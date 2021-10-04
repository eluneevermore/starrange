class Queue {
  constructor() {
    this.queue = {}
    this.head = 0
    this.tail = 0
  }

  enqueue = function (item) {
    this.queue[this.tail++] = item
  }

  dequeue = function() {
    const item = this.queue[this.head]
    delete this.queue[this.head++]
    return item
  }

  empty = function() {
    return this.head === this.tail
  }
}

export default Queue
