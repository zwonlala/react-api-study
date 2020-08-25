### 전에 작성한 내용 커스텀 훅을 만들어 코드 간단하게 만들기

새로운 파일을 만들어 이전에 작성한 reducer 함수를 그대로 복붙하고,

우리가 이번에 만들 userAsync 커스텀 훅 함수를 작성.

함수의 파라미터는 callback, deps 이렇게 두가지 인데,

- **callback** : api 를 호출하는 함수가 담긴, 원하는 데이터를 받아올 콜백함수
- **deps** : dependencies를 의미하는 deps 배열.
  <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  나중에 useEffect를 사용했을때, 컴포넌트가 로딩됐을때나 어떤 값이 변경되었을때 사용할 값.
  <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  기본값을 빈 배열(컴포넌트가 처음 렌더링 될때만 실행하겠다)

이렇게 두가지 파라미터를 사용

```javascript
function useAsync(callback, deps = []) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  });

  //작성중...
}
```

그 다음, 함수의 인자로 받은 callback 함수(REST api를 요청하는 함수)를 사용하는 fetchData 함수를 작성.  
try-catch 문을 사용하여, 각 상황에 맞게 dispatch 함수를 사용하여 구현한 이전 코드와 비슷하고,  
이전과 달리 callback 함수를 사용하는 것이 다름.  
그리고 완성한 함수를 useCallback 훅으로 감싸고, deps 인자에 '[callback]'을 넣어주어 callback 함수가 변경되었을때만, 새로 만들어지게 재사용을 할수 있게 구현을 해줌.

```javascript
const fetchData = useCallback(async () => {
  dispatch({ type: "LOADING" });
  try {
    const data = await callback();
    dispatch({ type: "SUCCESS", data });
  } catch (e) {
    dispatch({ type: "ERROR", error: e });
  }
}, [callback]);
```

그리고 useEffect 훅을 사용하여 위에서 작성한 fetchData 함수를, useAsync 함수의 파라미터로 입력받은 deps 가 변했을때만/렌더링 됐을때 실행되게 설정해주고
**+** eslint를 사용하는 경우 deps를 설정해주는 부분에 노란 줄이 생기는데, 이걸 비활성화 시키기 위해 바로 위에 `//eslint-disable-next-line` 이 줄을 삽입하면 된다.

```javascript
useEffect(() => {
  fetchData();
  //만약 eslint를 적용했으면 밑에 deps 부분에서 워닝이 뜨는데, 그걸 비활성화 해주기 위해 아래 주석 작성함.
  //내 코드에서는 eslint 적용안해서 원래 워닝 발생안함.
  //eslint-disable-next-line
}, deps);
```

그 다음 state와 작성한 fetchData 함수를 묶어 리턴함.

```javascript
return [state, fetchData];
```

<details>
<summary><b>전체 코드</b></summary>

```javascript
import { useReducer, useEffect, useCallback } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        data: null,
        error: null,
      };
    case "SUCCESS":
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case "ERROR":
      return {
        loading: false,
        data: null,
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action.type: ${action.type}`);
  }
}

//우리가 만들 커스텀 훅 함수
//callback : api 를 호출하는 함수가 담긴, 원하는 데이터를 받아올 콜백함수
//deps : dependencies를 의미하는 deps 배열.
//       나중에 useEffect를 사용했을때, 컴포넌트가 로딩됐을때나 어떤 값이 변경되었을때 사용할 값.
//       기본값을 빈 배열(컴포넌트가 처음 렌더링 될때만 실행하겠다)
function useAsync(callback, deps = []) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  });

  //useCallback을 사용하여 fetchData를 매번 새로 만드는 것이 아니라,
  //callback 함수가 변경되었을때만 새로 만들어지게 재사용할 수 있게 설정!
  const fetchData = useCallback(async () => {
    dispatch({ type: "LOADING" });
    try {
      const data = await callback();
      dispatch({ type: "SUCCESS", data });
    } catch (e) {
      dispatch({ type: "ERROR", error: e });
    }
  }, [callback]);

  useEffect(() => {
    fetchData();
    //만약 eslint를 적용했으면 밑에 deps 부분에서 워닝이 뜨는데, 그걸 비활성화 해주기 위해 아래 주석 작성함.
    //내 코드에서는 eslint 적용안해서 원래 워닝 발생안함.
    //eslint-disable-next-line
  }, deps);

  return [state, fetchData];
  //이렇게 두 값을 리턴하면, useAsync 커스텀 훅을 통해서
  //첫번재 값을 통해 상태를 리턴하고,
  //두번째 값을 통해 특정 요청을 다시 시작하는 함수를 받아와서 쓸수가 있음
}

export default useAsync;
```

</details>
