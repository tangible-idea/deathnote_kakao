import {useState, useCallback} from 'react';

/** (입력 관리자)
 * 폼에서 입력한 값을 담아두고,
 * 담겨있는 값을 조회하는 용도로 사용한다. */
export default (initialValue = null) => {
    const [value, setValue] = useState(initialValue);

    const handler = useCallback((e) => {
        setValue(e.target.value)
    }, []);

    return [value, handler, setValue]
}