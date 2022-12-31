//계층 구조 만들기
export function makeHierarchy(data){
    const result = {};
    result[data.id] = data;
    return result;
}
