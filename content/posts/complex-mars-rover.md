+++
title = 'Using Complex Numbers to Move Mars Rover'
date = 2023-02-15
tags = [
    "math",
]
+++

Recently I was given [Mars Rover Problem](https://code.google.com/archive/p/marsrovertechchallenge/) and told that my solution was pretty cool. Before that I assumed this is how everybody else was doing it ;). Here is [golang implementation](https://github.com/pratikdeoghare/mars-rover-problem). Enjoy!

## Design
Position and orientation are represented as complex numbers implemented as `type vect`. Builtin complex type is not used because it uses floats which they can't be compared easily.

In calculations below $j = \sqrt{-1}$.

### Multiplication of complex numbers allow us to rotate.

$L$: To rotate by $90^o$ left we multiply by $j$.

$R$: To rotate by $90^o$ right we multiply by $-j$.

Mapping of directions to complex numbers.

$North = j$ 

$East = 1$

$West = -1$

$South = -j$
        
Example: A rover is looking $North$ and we issue $R$ command. We expect the rover to look $East$. 

$$ North * R
= j * -j
= 1
= East $$  Position unchanged. 
    
### Addition of complex numbers allow for movements on the grid.

Example: A rover is at $(1,2)$ looking to $East$ and we issue $M$ command we expect it to be at $(2,2)$.

$$ \text{Rover positioned at} \ (1,1) + E
= (1 + 2j) + 1
= 2 + 2j
= (2, 2) $$  Orientation unchanged. 
