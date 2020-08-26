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

<br><br><br><br>

### 사용자의 인터렉션이 있을때만 API 요청하는 코드 만들어 보기

이전 코드는 그냥 렌더링 될때 REST api를 요청하여 데이터를 받아온다.  
이번에는 자동으로 로딩되는 것이 아니라, 사용자가 요청했을때 데이터를 받아오는 방식을 구현해 볼 것이다.

<br><br>

이전에 작성한 useAsync 함수에 세번째 파라미터를 설정할 것.

```javascript
//skip : 처음 렌더링 될 때 정보를 불러올지, 말지 설정하는 값. 기본값은 false
function useAsync(callback, deps = [], skip = false) {

//...생략
```

<br>

그리고 useEffect를 설정하는 부분에서 조건문을 삽입

```javascript
useEffect(() => {
  //만약 skip이 true 이면, return 하여 아래 fetchData 함수가 시행되지 않음.
  if (skip) {
    return;
  }

  fetchData();
  //eslint-disable-next-line
}, deps);
```

<br>

만약 skip이 true 이면, fetchData 함수를 실행하지 않고 바로 리턴해서 아무것도 보여주지 않음

그리고 Users 컴포넌트에서 useAsync 함수에 세번째 파라미터로 True값을 설정해줌.

```javascript
const [state, refetch] = useAsync(getUsers, [], true);
```

<br>

그리고 이전에 에러와 오류 상황을 핸들링하는, `if (!users) return null;` 이 문장을

```
if (loading) return <div>로딩중...</div>;
if (error) return <div>에러가 발생했습니다...</div>;
if (!users) return <button onClick={refetch}>불러오기</button>;
//아무것도 없을때 return null 해주는 것이 아니라 버튼을 리턴해, 사용자가 버튼을 누르면 데이터를 요청하게 수정
```

이렇게 수정함.  
그래서 Users 컴포넌트가 처음 렌더링 되면, 화면에 불러오기 버튼만 나타나게 되고,  
사용자가 버튼을 클릭하면 데이터가 로딩되고 화면에 나타남

<br><br><br><br>

### API 요청을 할때, 특정 파라미터가 필요할 때는 어떻게 하는가?

해당 요청을 처리하기 위한 새로운 컴포넌트 User 컴포넌트를 만든다.

이전에 만들었던 useAsync 훅을 불러오고,

id 값을 입력받아 해당 id의 user 정보를 get 하여 return 하는 getUser 함수를 구현하고,

```javascript
async function getUser(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}
```

<br><br>

User 컴포넌트 내에서 useAsync 훅을 사용하여 state를 받아오고  
(refetch는 사용할 일이 없어 안받아옴.)<br>

`const [state] = useAsync(() => getUser(id), [id]);`

<br>

> **+** useAsync의 첫번째 인자로 `getUser(id)` 가 아닌, `() => getUser(id)` 이걸로 설정하는 이유는<br>
> `getUser(id)`가 되면 함수 호출이 되어버려 콜백함수를 설정할수가 없음. <br>
> 그래서 **`"TypeError: callback is not a function"`** 발생.<br><br>
> getUsers 함수 같은 경우 함수값을 보낼 필요가 없으니<br> `const [state, refetch] = useAsync(getUsers, []);` 이렇게 설정이 가능!<br>

<br><br>

그리고 이전 처럼 state에서 값들을 뽑아 에러처리를 해주고,

```javascript
const { loading, data: user, error } = state;

if (error) console.log(error);
if (loading) return <div>로딩중....</div>;
if (error) return <div>에러가 발생했습니다.</div>;
if (!user) return null;
```

우리가 원하는 데이터를 컴포넌트 내에 보여줌.

<details>
<summary><b>전체 코드</b></summary>

```javascript
import React from "react";
import axios from "axios";
import useAsync from "./useAsync";

async function getUser(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

function User({ id }) {
  const [state] = useAsync(() => getUser(id), [id]);
  //이곳에서 refetch를 사용할 일이 없어서 state만 입력받고,
  //id 값이 바뀔때마다 함수를 호출할 거니, deps로 [id] 값 전달
  const { loading, data: user, error } = state;

  if (loading) return <div>로딩중....</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>
        <b>E-mail: </b>
        {user.email}
      </p>
    </div>
  );
}

export default User;
```

</details>

<br><br><br><br>

그리고 Users 컴포넌트에서 useState를 통해 user의 id를 관리해주고

```javascript
const [userId, setUserId] = useState(null);
```

<br>

li 태그에 onClick을 설정해주어 user.id를 설정해줌

```javascript
<li key={user.id} onClick={() => setUserId(user.id)}>
```

<br>

그리고 userId 값이 존재하면 User 컴포넌트를 아래 출력해줌

```javascript
{
  userId && <User id={userId} />;
}
```

<br><br><br><br>
