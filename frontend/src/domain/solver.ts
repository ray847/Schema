import { BuildingEdgeModel, Interval, PreferenceModel, RoomModel, Time } from "../shared";
import { Task } from "./task";
import { Score, Scorer } from "./scorer";
import { zip, range } from "remeda";
import { MinHeap, MaxHeap, Queue } from "mnemonist";

type TaskIdx = number;
type RoomIdx = number;
export type Solution = {
  score: number,
  scoreComponents: {
    facility: Score,
    preference: Score,
    roomType: Score,
    travel: Score,
  },
  route: RoomIdx[],
  startTimes: Time[],
  taskSeq: TaskIdx[],
  travelLegs: {
    fromStep: number,
    toStep: number,
    roomChanged: boolean,
    score: Score,
    seconds: number,
  }[],
};
type BestRoomEntry = [Time, Score | null, RoomIdx | null];

export async function solve(
  tasks: Task[],
  rooms: RoomModel[][],
  intervals: Interval[][],
  preferences: PreferenceModel[],
  buildingEdges: BuildingEdgeModel[] = [],
): Promise<Solution | null> {
  const solver = new Solver(
    tasks,
    rooms,
    intervals,
    new Scorer(preferences, buildingEdges),
  );
  return solver.solve();
}

class Solver {
  readonly scorer!: Scorer;
  readonly tasks!: Task[];
  readonly rooms!: RoomModel[][];
  readonly intervals!: Interval[][];
  /* Computed from Preprocessing */
  scores: Score[][] = [];
  bestScoreRoomFrom: BestRoomEntry[][] = [];
  /* For Recursion */
  bestSolution: Solution | null = null;

  constructor(
    tasks: Task[],
    rooms: RoomModel[][],
    intervals: Interval[][],
    scorer: Scorer
  ) {
    if (tasks.length != rooms.length)
      throw new Error("tasks length doesn't match rooms length.");
    if (tasks.length != intervals.length)
      throw new Error("tasks length doesn't match intervals length.");
    for (var i = 0; i < tasks.length; ++i) {
      if (rooms[i].length != intervals[i].length)
        throw new Error(`rooms length doesn't match intervals length for task ${i}.`);
    }
    this.tasks = tasks;
    this.intervals = intervals;
    this.rooms = rooms;
    this.scorer = scorer;
  }

  solve(): Solution | null {
    this.preprocess();
    this.solveRecurse([], [], 0, range(0, this.tasks.length));
    return this.bestSolution;
  }

  preprocess() {
    // calculate the score for every task-room pair
    this.scores = zip(this.tasks, this.rooms).map(
      taskAndRooms => taskAndRooms[1].map(
        room => this.scorer.scoreRoom(room, taskAndRooms[0].constraint)
      )
    );
    // find the best score by time
    for (var i = 0; i < this.tasks.length; i++) {
      this.bestScoreRoomFrom.push([]);
      let task = this.tasks[i];
      let timeConstraint = task.constraint.time;
      let rooms = this.rooms[i];
      let intervals = this.intervals[i];
      let score = this.scores[i];
      // maintain current time, remaining rooms queue,
      // & a heap of currently available rooms
      var timeStamps: Queue<Time> = Queue.from(
        Array.from(new Set([
          timeConstraint.limit.st,
          ...intervals.map(interval => interval[0]),
          ...intervals.map(interval => interval[1]),
        ])).sort((left, right) => left - right)
      );
      var currTime = timeStamps.dequeue();
      var remainingRooms: MinHeap<RoomIdx> = MinHeap.from(
        range(0, rooms.length),
        (idx1, idx2) => intervals[idx1][0] - intervals[idx2][0]
      ); // sort by starting time
      const roomsHeap = new MaxHeap<RoomIdx>(
        (idx1, idx2) => score[idx1] - score[idx2]
      );
      // initialize inHeapRooms, remainingRooms, & roomsHeap
      var nextRoom = remainingRooms.peek();
      if (currTime == null) throw new Error("Intervals is empty.");
      while (nextRoom != null && intervals[nextRoom][0] <= currTime) {
        roomsHeap.push(nextRoom);
        remainingRooms.pop();
        nextRoom = remainingRooms.peek();
      }
      while (
        currTime != null &&
        timeConstraint.limit.ed - currTime >= timeConstraint.duration
      ) {
        var bestRoomIdx = roomsHeap.peek();
        // pop out of date rooms
        while (bestRoomIdx != null &&
          intervals[bestRoomIdx][1] - currTime < timeConstraint.duration) {
          roomsHeap.pop();
          bestRoomIdx = roomsHeap.peek();
        }
        var currentBest = this.bestScoreRoomFrom[i].at(-1);
        if (bestRoomIdx == null) { // no rooms
          if (currentBest?.at(2) !== null)
            this.bestScoreRoomFrom[i].push([currTime, null, null]);
        } else {
          if (currentBest?.at(2) !== bestRoomIdx)
            this.bestScoreRoomFrom[i].push(
              [currTime, score[bestRoomIdx], bestRoomIdx]
            );
        }
        // set currTime to next time stamp
        currTime = timeStamps.dequeue();
        if (currTime == null) break;
        // update heaps
        var nextRoom = remainingRooms.peek();
        while (nextRoom != null && intervals[nextRoom][0] <= currTime) {
          roomsHeap.push(nextRoom);
          remainingRooms.pop();
          nextRoom = remainingRooms.peek();
        }
      }
    }
  }

  solveRecurse(
    taskSeq: TaskIdx[],
    startTimes: Time[],
    currTime: Time,
    remaining: TaskIdx[]
  ) {
    // branch cutting
    if (!this.checkFeasibility(currTime, remaining)) return;
    // recursion
    if (remaining.length)
      for (const nextTask of remaining) {
        taskSeq.push(nextTask);
        const timeConstraint = this.tasks[nextTask].constraint.time;
        const earliestStart = Math.max(currTime, timeConstraint.limit.st);
        const latestStart = timeConstraint.limit.ed - timeConstraint.duration;
        let candidateStartTimes = new Set<Time>(
          [earliestStart].concat(this.intervals[nextTask]
            .map(interval => interval[0])
            .filter(startTime => startTime >= earliestStart))
        );
        for (const startTime of candidateStartTimes) {
          if (startTime > latestStart) continue;
          startTimes.push(startTime)
          this.solveRecurse(
            taskSeq,
            startTimes,
            startTime + this.tasks[nextTask].constraint.time.duration,
            remaining.filter((taskIdx) => taskIdx != nextTask)
          );
          startTimes.pop();
        }
        taskSeq.pop();
      }
    else { // end of recursion
      const candidateSolution = this.bestRoomRoute(taskSeq, startTimes);
      if (!candidateSolution) return;
      if (this.isBetterSolution(candidateSolution, this.bestSolution)) {
        this.bestSolution = candidateSolution;
      }
    }
  }

  private bestRoomRoute(
    taskSeq: TaskIdx[],
    startTimes: Time[],
  ): Solution | null {
    let bestSolution: Solution | null = null;
    const route: RoomIdx[] = [];
    const travelLegs: Solution["travelLegs"] = [];
    const scoreComponents: Solution["scoreComponents"] = {
      facility: 0,
      preference: 0,
      roomType: 0,
      travel: 0,
    };

    const recurse = (step: number) => {
      if (step === taskSeq.length) {
        const roomScore =
          scoreComponents.facility +
          scoreComponents.preference +
          scoreComponents.roomType;
        const score = this.scorer.scoreRoute(roomScore, scoreComponents.travel);
        const candidate: Solution = {
          score,
          scoreComponents: { ...scoreComponents },
          route: [...route],
          startTimes: [...startTimes],
          taskSeq: [...taskSeq],
          travelLegs: [...travelLegs],
        };

        if (this.isBetterSolution(candidate, bestSolution)) {
          bestSolution = candidate;
        }
        return;
      }

      const taskIdx = taskSeq[step];
      const startTime = startTimes[step];
      const candidateRooms = this.availableRoomsAt(taskIdx, startTime);
      for (const roomIdx of candidateRooms) {
        const room = this.rooms[taskIdx][roomIdx];
        const roomComponents = this.scorer.scoreRoomComponents(
          room,
          this.tasks[taskIdx].constraint,
        );
        let leg: Solution["travelLegs"][number] | null = null;

        if (step > 0) {
          const previousTaskIdx = taskSeq[step - 1];
          const previousRoom = this.rooms[previousTaskIdx][route[step - 1]];
          const legScore = this.scorer.scoreTravel(previousRoom, room);
          if (!Number.isFinite(legScore)) continue;

          leg = {
            fromStep: step - 1,
            toStep: step,
            roomChanged: String(previousRoom.key) !== String(room.key),
            score: legScore,
            seconds: this.scorer.travelSecondsBetweenRooms(previousRoom, room),
          };
          scoreComponents.travel += leg.score;
          travelLegs.push(leg);
        }

        scoreComponents.facility += roomComponents.facility;
        scoreComponents.preference += roomComponents.preference;
        scoreComponents.roomType += roomComponents.roomType;
        route.push(roomIdx);

        recurse(step + 1);

        route.pop();
        scoreComponents.facility -= roomComponents.facility;
        scoreComponents.preference -= roomComponents.preference;
        scoreComponents.roomType -= roomComponents.roomType;
        if (leg) {
          travelLegs.pop();
          scoreComponents.travel -= leg.score;
        }
      }
    };

    recurse(0);
    return bestSolution;
  }

  private availableRoomsAt(task: TaskIdx, startTime: Time): RoomIdx[] {
    const duration = this.tasks[task].constraint.time.duration;
    return range(0, this.rooms[task].length).filter(
      roomIdx =>
        this.intervals[task][roomIdx][0] <= startTime &&
        this.intervals[task][roomIdx][1] - startTime >= duration
    );
  }

  private isBetterSolution(
    candidate: Solution,
    current: Solution | null,
  ): boolean {
    if (current == null) return true;

    const epsilon = 1e-9;
    if (candidate.score > current.score + epsilon) return true;
    if (candidate.score < current.score - epsilon) return false;

    const candidateFinish = this.solutionFinishTime(candidate);
    const currentFinish = this.solutionFinishTime(current);
    if (candidateFinish !== currentFinish) {
      return candidateFinish < currentFinish;
    }

    return this.solutionStartTime(candidate) < this.solutionStartTime(current);
  }

  private solutionFinishTime(solution: Solution): Time {
    const lastIdx = solution.taskSeq.length - 1;
    if (lastIdx < 0) return 0;
    const lastTask = solution.taskSeq[lastIdx];
    return solution.startTimes[lastIdx] +
      this.tasks[lastTask].constraint.time.duration;
  }

  private solutionStartTime(solution: Solution): Time {
    return solution.startTimes[0] ?? 0;
  }

  bestRoomAt(task: TaskIdx, startTime: Time): BestRoomEntry | undefined {
    const entries = this.bestScoreRoomFrom[task];
    var low = 0;
    var high = entries.length - 1;
    var result: BestRoomEntry | undefined = undefined;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (entries[mid][0] <= startTime) {
        result = entries[mid];
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return result;
  }

  /**
   * Check if the input state is possible based **PURELY** on task end timing.
   *
   * This function is relatively cheap to call.
   *
   * @param currTime The starting time for the next tasks.
   * @param remaining The remaining tasks.
   * @returns A valid sequence if possible else null.
   */
  checkFeasibility(currTime: Time, remaining: TaskIdx[]): boolean {
    const sortedRemaining = [...remaining].sort(
      (task1: number, task2: number): number =>
        this.tasks[task1].constraint.time.limit.ed -
        this.tasks[task2].constraint.time.limit.ed
    );
    var curr = currTime;
    for (const taskIdx of sortedRemaining) {
      var start = Math.max(curr, this.tasks[taskIdx].constraint.time.limit.st);
      var deltaTime = this.tasks[taskIdx].constraint.time.limit.ed - start;
      if (deltaTime < this.tasks[taskIdx].constraint.time.duration)
        return false;
      curr = start + this.tasks[taskIdx].constraint.time.duration;
    }
    return true;
  }
};
