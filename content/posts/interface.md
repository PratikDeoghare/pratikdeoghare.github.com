+++
title = 'Embedding Golang Interfaces Into Structs To Simplify Testing'
date = 2021-05-07
tags = [
    "golang",
    "testing",
]
+++

You can embed an interface inside a struct in golang. I discovered it by accident not by reading the manual.

Here is a problem that it solves. There are many more in [Embedding in Go: Part 3 - interfaces in structs ](https://eli.thegreenplace.net/2020/embedding-in-go-part-3-interfaces-in-structs/). 

You have a dependency on an external library. The library exports a large interface. You want to mock it for testing but then you will have to implement all the methods on it. That can be a lot of work. What if you could implement just the methods you need?

You can do that by embedding interfaces like this. You embed `LargeExternalClient` interface into `mockClient`, then implement only `MethodF` from the interface because that is the only one `YourClient` uses. If somewhere in the code some other method on the interface is in use without your knowledge and you don't implement it on `mockClient`, you will get a panic. A good thing. Then you just add that one. Test won't silently pass.


[Playground link](https://play.golang.org/p/YqlBS6oRME8)



    package main

    import (
        "testing"
    )

    // somewhere in the imported library.go

    type LargeExternalClient interface {
        MethodA()
        MethodB()
        MethodC()
        MethodD()
        MethodE()
        MethodF() int
        MethodG()
        MethodH()
        MethodI()
    }

    // code.go
    type YourClient struct {
        cli LargeExternalClient
    }

    func (y YourClient) Foo() int {
        return y.cli.MethodF()
    }

    // code_test.go

    type mockClient struct {
        LargeExternalClient
    }

    func (mockClient) MethodF() int {
        return 23
    }

    func TestYourClient(t *testing.T) {
        y := YourClient{
            cli: new(mockClient),
        }

        if y.Foo() != 23 {
            t.Fail()
        }
    }

