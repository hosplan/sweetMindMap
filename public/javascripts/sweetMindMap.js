import { renderGridLine } from './gridLine.js';
import { treeShape } from './treeShape.js';

export class SweetMindMap {
    constructor(div_id, data) {
        this.div_id = div_id; 
        this.width = document.getElementById(div_id).clientWidth;
        this.height = document.getElementById(div_id).clientHeight;
        this.total_g = undefined;
        this.nodes = undefined;
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
        this.point_data = []; // reset point data
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

            this.total_g = this.svg.append('g')
                .attr('class', 'total_g')
                .attr('id', 'total_g');
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
        return new Promise(resolve => {
            const s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };

            Promise.all([s4(), s4(),s4(),s4(),s4(),s4(),s4(),s4(),])
            .then((result) => {
                resolve(
                    result[0] +result[1] + '-' + result[2] + '-' + result[3] + '-' +
                    result[4] + '-' + result[5] + result[6] + result[7]
                );
            });
        });
    }

    shiftNode(){
        let shift_data = this.point_data.shift();
        let this_circle = d3.select(`circle[id='circle_${shift_data.id}']`);
        this_circle.attr('stroke', '#ffd500')
            .attr('stroke-width', 0);
    }

    initPtdata(){
        this.point_data.length = 0;
        let all_circle = d3.selectAll(`circle[class='node_part']`);
        all_circle.attr('stroke','#ffd500')
            .attr('stroke-width', 0);
    }

    renderPath(guid){
        return new Promise(resolve => {
            let path = this.total_g
                .append('path')
                .data([this.point_data])
                .attr('id', `path_${guid}`)
                .attr('class','line')
                .attr('sourceId',this.point_data[0].id)
                .attr('targetId',this.point_data[1].id)
                .attr('fill', 'none')
                .attr('stroke-width', '1px')
                .attr('stroke', '#a8a8a8')
                .attr('stroke-opacity', 0.8)
                .attr('d', this.line)
                .on('mouseenter', (event, d) =>{
                
                });

                let x_interpolate = d3.interpolate(this.point_data[0].x, this.point_data[1].x);
                let y_interpolate = d3.interpolate(this.point_data[0].y, this.point_data[1].y);
                let tt = x_interpolate(0.5);
                let kk = y_interpolate(0.5);
                this.total_g
                .append('g')
                .attr('transform', `translate(${tt},${kk})`)
                .append('text')
                .attr('font-weight', 200)
                .attr('text-anchor', 'middle')
                .text('New Relation');
                // let text = this.total_g
                // .append('text')
                // .attr('x', )
                // .attr('font-weight', 200);

                // text.append('textPath')
                //     .attr('xlink:href',`#path_${guid}`)
                //     .text('테스트용');
            
            resolve();
        })    
    }

    connectNode(){
        return new Promise(resolve => {
            this.getGuid()
                .then(guid => this.renderPath(guid))
                .then(() => resolve());
        });
    }

    raiseAllNode(){
        let node_part = d3.selectAll(`g[class='node_circle']`);
        node_part.raise();
    }

    renderCircle(guid, node){
        node.append('circle')
        .attr('r', 15)
        .attr('id', `circle_${guid}`)
        .attr('fill', '#ffd500')
        .attr('stroke', '#ffd500')
        .attr('class', 'node_part')
        .on('click', (event,d) => {
            let this_g = d3.select(`g[id='${guid}']`);
            let this_circle = d3.select(`circle[id='circle_${guid}']`);

            this_circle
            .attr('stroke', '#f3f3f3')
            .attr('stroke-width', 5);

            this.point_data.push({
                    id: guid,
                    x:this_g.attr('coord_x'),
                    y:this_g.attr('coord_y')
                });

            if(this.point_data.length > 1) {
                this.connectNode().then(() => {
                    this.shiftNode();
                    this.raiseAllNode();
                });
            }
        });        
    }

    renderText(guid, node){
        node.append('text')
        .attr('dy', 40)
        .attr('text-anchor', 'middle')
        .attr('class', 'node_part')
        .text('New Node');
    }

    addNode(e){
        this.getGuid().then(guid => {
            let coords = d3.pointer(e);
            let node = this.total_g
                .append('g')
                .attr('transform', `translate(${coords[0]},${coords[1]})`)
                .attr('class', 'node_circle')
                .attr('coord_x', coords[0])
                .attr('coord_y', coords[1])
                .attr('id', `${guid}`);
            
            this.renderCircle(guid, node);
            this.renderText(guid, node)
        });
    }

    render(source) {
        return new Promise((resolve, reject) => {
            this.svg
                .attr('viewBox', [0, 0, this.width, this.height])
                .on('dblclick', (event, d) => {
                    this.addNode(event);
                    this.initPtdata();
                })
        });
    }

    spreadBranches() {
        this.setting()
            .then(() => this.render(this.root, true));
    }
}