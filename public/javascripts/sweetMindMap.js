import { renderGridLine } from './gridLine.js';
import { treeShape } from './treeShape.js';

export class SweetMindMap {
    constructor(div_id, data) {
        this.div_id = div_id; 
        this.width = document.getElementById(div_id).clientWidth;
        this.height = document.getElementById(div_id).clientHeight;
        this.tree = d3.tree().size([this.height, this.width]);
        this.root = data !== undefined ? d3.hierarchy(data) : undefined;
        this.total_g = undefined;
        this.nodes = undefined;
        this.links = undefined;
        this.margin = { top: 20, right: 20, bottom: 30, left: 150 };
        this.svg = undefined;
        this.activeId = undefined;
        this.duration = 1000;
        this.parentSvg = {
            'position': 'absolute',
            'pointer-events': 'none',
            'z-index': 1,
            'id': 'sweet_mindmap_parent_svg'
        };
        this.bodyDiv = {
            'id': 'sweet_mindmap_body_div',
            'overflow': 'auto'
        }
        this.data = {};
        this.divideNum = 2;
        this.line = d3.line()
            .x((d) => d.x)
            .y((d) => d.y);
        this.ptdata = []; // reset point data
    }

    renderData() {
        return new Promise((resolve, reject) => {
            try {

            }
            catch (e) {
                console.log(e);
                reject('ErrorRenderData');
            }
        })
    }

    settingBodySvg() {
        return new Promise((resolve, reject) => {
            let width = document.getElementById(`${this.bodyDiv['id']}`).clientWidth;
            let height = document.getElementById(`${this.bodyDiv['id']}`).clientHeight;
            this.svg = d3.select(`div[id='${this.bodyDiv['id']}']`)
                .append('svg')
                .style('display', 'block')
                .attr('stroke', 'black')
                .attr('stroke-opacity', 1)
                .attr('id', 'sweet_mindmap_svg');

            resolve({ w: width, h: height, id: 'sweet_mindmap_svg' });
        });
    }

    settingToolBox() {
        return new Promise((resolve, reject) => {
            try {
                let toolBox = `<div id="sweetMindMap_toolBox" class="row" style='height:${this.height * 0.1}px'>
                    <div id="addTaskBtn" class="col m-2 p-2" style="background-color:#0098fe; color:white; border-radius: 4px; display:flex; justify-content:center; cursor:pointer; align-items:center; width:102px; height:32px;">
                        할일 추가
                    </div>
                    <div id="addTaskBtn" class="col m-2 p-2" style="background-color:#0098fe; color:white; border-radius: 4px; display:flex; justify-content:center; cursor:pointer; align-items:center; width:102px; height:32px;">
                        할일 삭제
                    </div>
                    <div id="addTaskBtn" class="col m-2 p-2" style="background-color:#0098fe; color:white; border-radius: 4px; display:flex; justify-content:center; cursor:pointer; align-items:center; width:102px; height:32px;">
                        할일 펼치기
                    </div>
                    <div id="addTaskBtn" class="col m-2 p-2" style="background-color:#0098fe; color:white; border-radius: 4px; display:flex; justify-content:center; cursor:pointer; align-items:center; width:102px; height:32px;">
                        드래그 On
                    </div>
                    <div id="addTaskBtn" class="col m-2 p-2" style="background-color:#0098fe; color:white; border-radius: 4px; display:flex; justify-content:center; cursor:pointer; align-items:center; width:102px; height:32px;">
                        찾아보기
                    </div>
                </div>`;

                document.getElementById('sweetMindMap').innerHTML = toolBox;
                let addTaskBtn = document.querySelector(`div[id='addTaskBtn']`);
                addTaskBtn.onclick = () => { console.log('addTask') }
                resolve();
            }
            catch (e) {
                console.log(e);
                reject(e);
            }

        })
    }

    //div 셋팅
    settingDiv() {
        return new Promise((resolve, reject) => {
            try {
                d3.select(`div[id='${this.div_id}']`)
                    .append('div')
                    .attr('id', this.bodyDiv['id'])
                    .attr('class', 'col')
                    .style('height', `${this.height}px`)
                    .style('overflow', this.bodyDiv['overflow']);

                resolve();
            }
            catch (e) {
                reject('Error : RenderBodySvg');
            }
        });
    }

    //계산
    calc(d) {
        let l = d.y;
        if (d.position === 'left') {
            l = (d.y) - w / 2;
            l = (w / 2) + l;
        }
        return { x: d.x, y: l };
    }
    //직각 만들기
    elbow(d) {
        let source = this.calc(d.source);
        let target = this.calc(d.target);
        let hy = (target.y - source.y) / 2;
        return `M${source.y},${source.x}H${source.y + hy}V${target.x}H${target.y}`;
    }

    //셋팅
    setting() {
        return new Promise((resolve) => {
            this.settingToolBox()
                .then(() => this.settingDiv())
                .then(() => this.settingBodySvg())
                .then((svg_obj) => resolve(svg_obj));
        });
    }

    getGuid() {
        const s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    makeNode(name, value, data) {
        const node = {
            name: name === undefined ? `temp` : name,
            value: value === undefined ? `temp` : value,
            data: data === undefined ? {} : data,
            guid: this.getGuid()
        };

        return node;
    }

    setData(data) {
        //부모값을 찾은뒤
        //해당 부모값의 
    }

    makeRoot(svg_obj) {
        return new Promise((resolve, reject) => {
            try {
                this.total_g = this.svg.append('g')
                    .attr('class', 'total_g')
                    .attr('id', 'total_g');

                if (this.root === undefined) {
                    const root = {
                        name: `root`,
                        value: `root`,
                        guid: this.getGuid(),
                        // children: [
                        //     {
                        //         name : `node1`,
                        //         value :`node1`,
                        //         guid : this.getGuid(),
                        //         status : 'complete',
                        //         children : [
                        //             {
                        //                 name : `node2`,
                        //                 value :`node2`,
                        //                 guid : this.getGuid(),
                        //                 status : 'inProgress'
                        //             }
                        //         ]
                        //     },
                        //     {
                        //         name : `node1-1`,
                        //         value :`node1-1`,
                        //         guid : this.getGuid(),
                        //         status : 'ready'
                        //     }
                        // ],
                    }
                    this.root = d3.hierarchy(root);
                }
                resolve();
            }
            catch (e) {
                console.log(e);
                reject(`Error : data is not`);
            }
        });
    }

    getDirection(data) {
        if (!data) {
            return 'root';
        }
        if (data.position) {
            return data.position;
        }
        return this.getDirection(data.parent);
    };


    addNode(d) {
        const selectNode = d3.select(`g[id='${d.data.guid}']`);
        this.width = this.width * 1.1;
        this.divideNum++;
        let data = selectNode._groups[0][0].__data__;     
        let dir = this.getDirection(data);
        let cl = data[dir] || data.children;
        if (!cl) {
            cl = data.children = [];
        }
        
        const newNode = { name : 'new_node', 
        value : 'node', 
        guid: this.getGuid(), 
        status : 'ready'
        };

        let tempValue = d3.hierarchy(newNode);
        tempValue.depth = data.depth + 1;
        tempValue.height = data.height - 1;
        tempValue.parent = data;
        cl.push(tempValue);
        this.render(data);
    };

    //x0, y0 좌표 만들기(x, y 좌표값 클론)
    setCloneCooperation(){
        this.nodes.forEach((d,i) => {
            d.id = i;
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    renderRect(g_node){
        g_node.append('rect')
            .attr('width', treeShape.task.width)
            .attr('height', treeShape.task.height)
            .attr('rx', treeShape.task.r)
            .attr('ry', treeShape.task.r)
            .attr('x', `${treeShape.task.x}em`)
            .attr('y', `${treeShape.task.y}em`)
            .attr('data-sort', 'rect')
            .attr('id', d => `rect_${d.data.guid}`)
            .attr('fill', d => d.depth === 0 ? treeShape.task.fill.project : treeShape.task.fill.task)
    }

    renderCircle(e){
      

        let coords = d3.pointer(e);
        this.total_g.append('g')
            .attr('transform', `translate(${coords[0]},${coords[1]})`)
            .attr('class', 'node_circle')
            .append('circle')
            .attr('r', 15)
            .attr('id', this.getGuid())
            .attr('fill', 'blue')
            .on('mousedown', (event, d) => {                 
                this.ptdata.push({ x: event.offsetX, y: event.offsetY });
            })
            .on('mouseup', (event,d) => {
                this.ptdata.push({x : event.offsetX, y: event.offsetY});
                console.log(this.ptdata);
                console.log(event);
                console.log("mouseup");
                this.total_g.append('path')
                        .data([this.ptdata])
                        .attr('class','line')
                        .attr('fill', 'none')
                        .attr('stroke-width', '2px')
                        .attr('stroke', '#000')
                        .attr('d', this.line);
                
                let circles = d3.selectAll(`g[class='node_circle']`);
                circles.raise();
            });
    }
    render(source) {
        return new Promise((resolve, reject) => {
            this.svg
                .attr('viewBox', [0, 0, this.width, this.height])
                .on('dblclick', (event, d) => {
                    this.renderCircle(event);
                })
        });
    }

    spreadBranches() {
        this.setting()
            .then((svg_size) => this.makeRoot(svg_size))
            .then(() => this.render(this.root, true));
    }
}