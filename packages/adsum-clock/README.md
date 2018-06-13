# Clock component

![image](https://user-images.githubusercontent.com/6003532/39854315-ce02252c-5459-11e8-826a-f59717fbff0f.png)

[Live examples here](https://adactivesas.github.io/adsum-react-components/packages/adsum-clock/examples/index.html)

## Getting started

```javascript
    npm i --save-dev @adactive/arc-clock
```
OR
```javascript
    yarn add --dev @adactive/arc-clock
```

```javascript
    import AdsumClock from "@adactive/arc-clock"
     ...
    const ClockUi = (props) => (
        <div role="presentation" className="adsum-clock-wrapper">
            <div className="adsum-clock">
                <div className="day-date">{props.dateStr}</div>
                <div className="time">{props.timeStr}</div>
            </div>
        </div>
    );

    const Clock = AdsumClock(ClockUi);

    <Clock lang="en" timeFormat="12hrs" />
```

### Props
 
```javascript
static defaultProps = {
    lang: 'en',
    timeFormat: '24hrs',
};

type AdsumClockPropsType = {
    lang: LangType,
    timeFormat: TimeFormatType
};
```

### Additional props, which will be passed to the provided ClockUi component:

```javascript

{
    +year: string,
    +month: string,
    +day: string,
    +hours: string,
    +minutes: string,
    +dateStr: string,
    +timeStr: string
};

```

```javascript
type LangType = 'en' | 'zh' | 'fr';
type TimeFormatType = '24hrs' | '12hrs';
type AdsumClockPropsType = {
    lang: LangType,
    timeFormat: TimeFormatType
};
```


## Copy component inside your project src folder  

### Less only
    `npx @adactive/arc-clock copy --less-only`
    
### Full copy
    `npx @adactive/arc-clock copy`
