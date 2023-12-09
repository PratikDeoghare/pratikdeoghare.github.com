+++
title = "Why Doesn't The Simple Formula Work?"
date = 2023-07-01
tags = [
    "math",
    "programming", 
    "puzzle",
]
+++

Problem: Write a program to find sum of all multiples of 3 and 5 upto input n.
If a number is multiple of both 3 and 5 add it only once.

We were given this problem at work. I tried to “solve” it using math. Clearly,
we can add all the multiples of 3 and 5 upto n and subtract multiples of 15 once
to account for the overcounting. We could derive formula for this as follows:

$$\begin{aligned} 
    f(n) &= (3 + 6 + 9 + \ldots) + (5 + 10 + 15 + \ldots) - (15 + 30 + 45 + \ldots) \newline 
         &= 3(1 + 2 + 3 + \ldots) + 5(1 + 2 + 3 + \ldots)   - 15 (1 + 2 + 3 + \ldots) \newline 
         &= 3S(n/3) + 5S(n/5) - 15S(n/15)  \text{\, where } S(k) := \frac{1}{2} k (k + 1) \newline 
         &= 3 \times \frac{1}{2} \frac{n}{3} \left( \frac{n}{3} + 1\right)
          + 5 \times \frac{1}{2} \frac{n}{5} \left( \frac{n}{5} + 1\right)
          - 15 \times \frac{1}{2} \frac{n}{15} \left( \frac{n}{3} + 1\right)
          \newline 
        &= \frac{n}{2} \left( \frac{n}{3} + 1 + \frac{n}{5} + 1 - \frac{n}{15} - 1  \right) \newline 
        &= \frac{n}{2} \left( \frac{n}{3} +\frac{n}{5} - \frac{n}{15} + 1  \right)
\end{aligned}$$


We write code to do the calculations for us like this:

    def s(n):
        return (n * (n + 1)) // 2
    
    def ss(n):
        return 3 * s(n//3) + 5 * s(n//5) - 15 * s(n//15)
    
    def sss(n):
        return (n // 2) * ( n // 3 + n // 5 - n // 15 + 1)

    tests = [(3, 3), (5,8),(0,0), (10,23+10), (1000, 233168+1000)]

    for (n, expected) in tests:
        print(n, expected, ss(n), sss(n))
    
    # print(n, expected, ss(n))
    assert ss(n) == expected

    # Outputs:
    # 3 3 3 2
    # 5 8 8 6
    # 0 0 0 0
    # 10 33 33 30
    # 1000 234168 234168 234000

Can you figure out why `ss` gives the right answer but `sss` doesn’t? Math is
straightforward isn’t it? Enjoy!