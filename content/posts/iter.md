+++
title = 'Iterating Over A Trie With Channels And Goroutines'
date = 2021-05-23
tags = [
    "golang",
    "data-structure",
    "concurrency",
]
+++

We have a trie that stores set of integer slices. We want an iterator over its items.

What we do here is have one goroutine to walk over the trie and send the items over channel. Other goroutine pulls the items from the channel and prints them out.

My mental image of this is one gopher jumping around a tree and throwing mangoes back at his friend on the ground.

This doesn't have to be a tree or trie. We can iterate over any structure like this. Golang makes it easy to think about such things.

This has been suggested before and there are some problems with it as pointed out [here](https://github.com/golang/go/issues/43557#issuecomment-755784044). In this post however I only wanted demonstrate this interesting way of thinking and not worry about performance and other issues.

    // goroutine that sends the items over the channel

    func (t setSliceInt) Iter() chan []int {
        ch := make(chan []int)
        go t.iter(nil, ch)
        return ch
    }

    func (t setSliceInt) iter(acc []int, ch chan []int) <-chan []int {
        if t.end {
            ch <- acc
        }

        for k, v := range t.kids {
            v.iter(append(acc, k), ch)
        }

        if len(acc) == 0 {
            close(ch)
        }

        return ch
    }
&nbsp; 

    // some other goroutine pulls the items and prints

    ...
        for item := range t.Iter() {
            fmt.Println(item)
        }
    ...

Full code bewlow and [in the playground](https://play.golang.org/p/QMQJRchVYLY).

    package main

    import (
        "fmt"
    )

    // Set of []int.
    // Slices of integers are strings made up of integers.
    // We can use trie to represent their set.
    // Add, Remove, Membership checking are all linear in the length of
    // the element and don't depend on the number of items in the set.

    type setSliceInt struct {
        end  bool
        kids map[int]*setSliceInt
    }

    func (t setSliceInt) Has(xs []int) bool {
        if len(xs) == 0 {
            return t.end
        }

        v, ok := t.kids[xs[0]]
        return ok && v.Has(xs[1:])
    }

    func (t *setSliceInt) Remove(xs []int) {
        if len(xs) == 0 {
            t.end = false
            return
        }

        v, ok := t.kids[xs[0]]
        if !ok {
            return
        }

        v.Remove(xs[1:])

        if !v.end && len(v.kids) == 0 {
            delete(t.kids, xs[0])
        }

    }

    func (t *setSliceInt) Add(xs []int) {
        if len(xs) == 0 {
            t.end = true
            return
        }

        if t.kids == nil {
            t.kids = make(map[int]*setSliceInt)
        }

        _, ok := t.kids[xs[0]]
        if !ok {
            t.kids[xs[0]] = new(setSliceInt)
        }

        t.kids[xs[0]].Add(xs[1:])
    }

    func (t setSliceInt) String() string {
        return str(t, "")
    }

    func str(t setSliceInt, tabs string) string {
        var ks string
        for k, v := range t.kids {
            if v.end {
                ks += fmt.Sprintf("%s (%d) \n %s", tabs, k, str(*v, tabs+" "))
            } else {
                ks += fmt.Sprintf("%s %d \n %s", tabs, k, str(*v, tabs+" "))
            }
        }
        return ks
    }

    func (t setSliceInt) Iter() chan []int {
        ch := make(chan []int)
        go t.iter(nil, ch)
        return ch
    }

    func (t setSliceInt) iter(acc []int, ch chan []int) <-chan []int {
        if t.end {
            ch <- acc
        }

        for k, v := range t.kids {
            v.iter(append(acc, k), ch)
        }

        if len(acc) == 0 {
            close(ch)
        }

        return ch
    }

    func main() {
        t := new(setSliceInt)

        t.Add([]int{1, 2, 3, 4})
        t.Add([]int{23, 3, 3})
        t.Add([]int{1, 2, 3})
        fmt.Println(t)
        fmt.Println(t.Has([]int{1, 2, 3, 4}))
        t.Remove([]int{1, 2, 3, 4})
        fmt.Println(t)

        for item := range t.Iter() {
            fmt.Println(item)
        }

    }
