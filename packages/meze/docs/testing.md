# Testing

As strong believers in the benefits of TDD we don't like untestable code. In fact, we have rejected libraries and solution for lack of testability before.

This is why one of our chief concerns when designing Meze was to make it testable.

Our TestUtils are designed to leverage this testability to provide developers with simple assertion friendly APIs in order to stay compatible with as many test runner or assertion library you feel comfortable with.
The examples in this doc use the Ava testing library, which is the library we use to test most of the *Meze* library, but you should be able to extrapolate from these examples tp your library of choice.

Strongly inspired by the [enzyme](http://airbnb.io/enzyme/) library, we provide a **shallowComposer** which will compose your *Meze* component, but only do so one level deep.

The shallowComposer returns a **CompositionWrapper**, which acts as a wrapper for the return value of the composed component.
The wrapper provides a rich API for asserting against the returned value itself and for analyzing component instances within the return value.

**The TestUtils are still very basic, but they are now our main focus and should provide a much richer toolset in the near future.**

### Meze.TestUtils

#### shallowCompose(component, context) => CompositionWrapper
1. **component** - A component instance to compose 
2. **context** - (optional) Composition context 

### CompositionWrapper
Composition wrappers shouldn't be created manually, and are instanciated by either the shallowCompose function or its methods.
When calling methods of the CompositionWrapper, keep in mind that they refer to the return value of the shallowComposed component, not the component itself. 

#### porperties
1. **composition** The actual composition returned by the component when mounted. The core *compose* would compose not just the return value of the component, but also the composition of any child components. shallowCompose, on the other hand, doesn't compose child components, but rather returns the unmounted component instances, with makes it easier to unit test the actual opperation of the component being tested.

#### methods for all return values
1. *isEmpty() => boolean* Returns whether or not the composition results in an *undefined* value.
1. *find(selector : Component)* (selector: A Component or Component Instance) Searched for matching Components/Instances in the returned value
```js
test(`ChildrenAsArrayComponents should return an array of its composed children`, async t => {
  const ChildrenAsArrayComponents = ({ children }) => Meze.Children.only(children)
  const DumbComponent = ({ msg = 'hi' }) => msg
  const UnusedComponent = () => 0

  const res = await shallowCompose(
    <ChildrenAsArrayComponents>
      <DumbComponent msg="there" />
    </ChildrenAsArrayComponents>
  )

  t.deepEqual(
    res.find(DumbComponent)[0].props(),
    { msg: 'there' }
  )

  t.deepEqual(
    res.find(UnusedComponent).length,
    0
  )
})
```
1. *is(componentType : Component)* (componentType: A Component or Component Instance) returns **true** if the returned component matches the Component/Instance
```js
test(`ChildrenAsOnlyComponent should return the only child component it's composed with`, async t => {
  const ChildrenAsOnlyComponent = ({ children }) => Meze.Children.only(children)
  const DumbComponent = ({ msg }) => msg

  const res = await shallowCompose(
    <ChildrenAsOnlyComponent>
      <DumbComponent msg="haha" />
    </ChildrenAsOnlyComponent>
  )

  t.truthy(
    res.is(DumbComponent)
  )

  t.truthy(
    res.not(<DumbComponent msg="hi" />)
  )

  t.truthy(
    res.is(<DumbComponent msg="haha" />)
  )
})
```
1. *not(componentType : Component)* (componentType: A Component or Component Instance) returns **false** if the returned component matches the Component/Instance
1. *contains(componentType : Component)* (componentType: A Component or Component Instance) Searched for a matching Component/Instance in the returned value and returns whether it found any

#### methods for returned component instances 
1. *props(?propName : String)* Returns the value of the prop on the root component instance or if no *propName* is specified, returns the whole *props* object.  
1. *context(?propName : String)* Returns the value of the context of the root component instance or if no *propName* is specified, returns the whole *props* object.
