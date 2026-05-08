# Math

Route optimization math for the planning.

## Planning

The planning process can be reduced to essentially a mixed integer linear programming problem (MILP).

We define the following variables:

| Independent Variable | Domain | Meaning |
|-|-|-|
|$t_i$|$[0, 24 \times 60]$| Timestamps between (or before and after) room switches. (In minutes) |
|$\mathbf{r}_i = \begin{pmatrix} r_{i, room1} \\ r_{i, room2} \\ \vdots \end{pmatrix}$|$\{0, 1\}$|The room to switch to at time $t_i$. $room$ is for one-hot encoding.|
|$\mathbf{b}_i = \begin{pmatrix} b_{i, task1} \\ b_{i, task2} \\ \vdots \end{pmatrix}$|$\{0, 1\}$| Whether to do task $task$ at interval $i$. |

| Dependent Variable | Meaning |
|-|-|
|$d_i = t_{i + 1} - t_i$| Duration spent in a room. |
|$\mathbf{u}_i = \text{ele max} \{ b_{i, task} \cdot \mathbf{u}_{task} \}$| Facility usage / urgency at interval $i$. |
|$F_i = \mathbf{u}_i \cdot \mathbf{F} \cdot \mathbf{r}_i$| Facility fitness at interval $i$. |
|$P_i = \mathbf{P} \cdot \mathbf{r}_i$| Preference level at interval $i$. |
|$D_i = \mathbf{r}_{i - 1} \mathbf{D} \mathbf{r}_i$| Distance from room at $i - 1$ to $i$. |

With the above variables, we can express the MILP as:

$$
\max \alpha \mathcal{F} -\beta \mathcal{D} + \gamma \mathcal{P} \\
s.t. \\
\mathcal{F} = \sum F_i \cdot d_i \\
\mathcal{D} = \sum D_i \\
\mathcal{P} = \sum P_i \cdot d_i \\
\begin{cases}
\sum_i \mathbf{b}_i = \mathbf{1} & \text{(Complete all tasks.)} \\
\forall i, d_i \geq \mathbf{b}_i \cdot \mathbf{d} & \text{(Enough time for tasks.)}
\end{cases}
$$