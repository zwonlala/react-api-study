### useReducer 사용하여 이전 코드 수정하기!

<br>

### useState가 아닌 useReducer를 사용했을때, 장점!

**1. 요청관리에 대한 로직을 따로 분리하여 나중에 재사용할 수 있다.**

아래서 제작한 reducer 함수를 따른 파일로 뽑아내면  
('reducer' 드래그 후 마우스 오른쪽 **`'리펙토링'`** -> **`'새 파일로 이동'`** 하면 별개의 파일로 분리됨)  
나중에 다른 컴포넌트를 만들때도 위 reducer 함수를 재사용할 수 있음.

<br><br>

우선 기존의 **`useState`** 를 사용하는 코드를 다 지워준다.

그리고 우리가 처리해줄 case에 대한 reducer 함수의 뼈대만 작성해줌

```javascript
//LOADING, SUCCESS, ERROR 세 case 관리
function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
    case "SUCCESS":
    case "ERROR":
    default:
      throw new Error(`Unhandled action.type: ${action.type}`);
  }
}
```

<br><br>

그리고 User 함수 내에서 **`useReducer`** 사용하여 초기값 설정.

```javascript
const [state, dispatch] = useReducer(reducer, {
  loading: false,
  data: null,
  error: null,
});
```

<br><br>

그리고 밑에 조건부 다른 내용을 리턴하는 부분에서 비구조화할당을 통해 코드의 에러(빨간줄)을 없애줌.  
기존의 코드는 'users'를 사용하지만, state에서 사용하는 것은 data 임.  
그래서 아래와 같이 `data: users` 라고 작성하여, data 값을 users에 비구조화 할당해줌!

```javascript
const { loading, data: users, error } = state;
```

<br><br>

그리고 아까 구조만 작성했떤 reducer 함수를 자세히 구현

```javascript
//LOADING, SUCCESS, ERROR 세 case 관리
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
```

<br><br>

그리고 User 컴포넌트 내에서 dispatch 함수를 사용하여 구현

```javascript
const fetchUsers = async () => {
  dispatch({ type: "LOADING" });
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users/"
    );
    dispatch({ type: "SUCCESS", data: response.data });
  } catch (e) {
    dispatch({ type: "ERROR", error: e });
  }
};
//여기서 Loading 값 false로 다시 안돌려 줘도 되나...?
// -> 'SUCCESS'와 'ERROR' action에서 바로 loading 값을 false로 설정해주기 때문에 노 프라블럼!
```

<br><br><br><br>
