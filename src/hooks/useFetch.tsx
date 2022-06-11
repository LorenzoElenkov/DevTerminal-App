import React, { useEffect, useState } from 'react';

const useFetch = (reqBody: {}) => {

    const [_data, setData] = useState<Promise<any> | null>(null);
    const [_error, setError] = useState<Promise<any> | null>(null);

    useEffect(() => {
        console.log(123);
        fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-Type': 'application/json',
                }
        })
        .then(resData => {
            setData(resData.json());
        })
        .catch(err => {
            setError(err);
        });
    })

    return { _data, _error };
}

export default useFetch;
