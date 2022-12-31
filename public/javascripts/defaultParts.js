import { SweetMindMap } from './sweetMindMap.js';
function renderParts(){
    console.log("123456");
    const sweetMindMap = new SweetMindMap('sweetMindMap');
    sweetMindMap.spreadBranches();
}

window.onload = () => {
    renderParts();
}
