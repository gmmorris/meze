# Component Lifecycle

Meze allows you to hook into various lifecycle events of components in a composition. Inspired by [Inferno](https://github.com/trueadm/inferno)'s Hook system, we allow both the component developer to hook into these events via DefaultProps and any developer using the component via regular props.

Below is the table of the various events you can hook into.

| Event name | When is the event called? | Arguments |
| ---------- | -------------- | ----------------------- |
| `componentWillMount` | a component is about to mount ||
| `componentDidMount` | a component has mounted successfully, has been composed and has its resulting composition is at hand | `composition` |
| `componentWillUnmount` | a component is about to be unmounted and its resulting composition has been flattened and is about to be returned to the parent component | `compositionResult` |
| `componentFailedMount` | a component has failed to mount and has resulted in a thrown exception or a rejected promise | `exceptionOrPromiseRejection` |

### Hooking into lifecycle events

Hooking into an event is as simple as adding a property on the component instance by the event name

```javascript
const { cloneWithProps, reduceComposed } = Meze.Children

const PosponedCompletion = ({ delay, val }) =>
  new Promise(resolve => setTimeout(() => {
      resolve(val)
    }, delay)
  )

const OrderedByCompletion = function ({ children }, { compose }) {
  const compositionsByCompletionOrder = []
  function addToOrderedCompositions(composition) {
    compositionsByCompletionOrder.push(composition)
  }
  
  const childrenWithEventListners =
    cloneWithProps(
      children,
      { componentWillUnmount: addToOrderedCompositions }
    )
  
  return compose(childrenWithEventListners)
    .then(compositionsByCompositionOrder => ({
      compositionsByCompositionOrder,
      compositionsByCompletionOrder
    }))
}

Meze.compose(
    <OrderedByCompletion>
      <PosponedCompletion delay={1000} val ={3} />
      <PosponedCompletion delay={500} val ={2} />
      <PosponedCompletion delay={3420} val ={4} />
      <PosponedCompletion delay={20} val ={1} />
    </OrderedByCompletion>
).then(console.log)
```

The above composition will log the following object to console:
```json
{ 
  compositionsByCompositionOrder: [ 3, 2, 4, 1 ],
  compositionsByCompletionOrder: [ 1, 2, 3, 4 ] 
}
```
