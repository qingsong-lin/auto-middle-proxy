package safe_conn

import (
	"fmt"
	"middle-proxy/log"
	"sync"
)

// SafeChannel 消费者close的chan, 生产者close的话用原生
type SafeChannel[T any] struct {
	ch           chan *T
	closed       bool
	mu           sync.Mutex
	size         int
	receivedSize int
}

func NewSafeChannel[T any](size int) *SafeChannel[T] {
	return &SafeChannel[T]{
		size: size,
		ch:   make(chan *T, size),
	}
}

func (sc *SafeChannel[T]) Send(value *T) {
	sc.mu.Lock()
	defer sc.mu.Unlock()
	if sc.size == sc.receivedSize {
		return
	}
	sc.receivedSize++
	if sc.closed {
		fmt.Println("Channel is closed, cannot send.")
		return
	}
	sc.ch <- value
}

func (sc *SafeChannel[T]) Close() {
	sc.mu.Lock()
	defer sc.mu.Unlock()

	if !sc.closed {
		close(sc.ch)
		sc.closed = true
		log.Logger.Info("SafeChannel close success")
	}
}

func (sc *SafeChannel[T]) IsClose() bool {
	return sc.closed
}

func (sc *SafeChannel[T]) Get() *T {
	return <-sc.ch
}

func (sc *SafeChannel[T]) End() {
	sc.mu.Lock()
	defer sc.mu.Unlock()

	if sc.receivedSize == 0 {
		sc.ch <- (*T)(nil)
	}
}
