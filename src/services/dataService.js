import { Link, LINK_TYPES }    from '../models/linkModel';
import { Node, NODE_TYPES }    from '../models/nodeModel';
import { Lyph } from '../models/lyphModel';
import { Graph } from '../models/graphModel';
import { assign, keys } from 'lodash-bound';
import { schemePaired, schemeDark2} from 'd3-scale-chromatic';

const colors = [...schemePaired, schemeDark2];

const addColor = (array, defaultColor) =>
    array.filter(obj => !obj.color)
        .forEach((obj, i) => { obj.color = defaultColor || colors[i % colors.length] });

/**
 * Create omega trees and lyphs tfor Kidney scenario
 * https://drive.google.com/file/d/0B89UZ62PbWq4ZkJkTjdkN1NBZDg/view
 */
export class DataService {
    entitiesById = {};

    constructor(){
        this._graphData = Graph.fromJSON({});
        this._lyphs = [];
        this._coalescences = [];
    }

    init(){
        const coreGraphData = {
            nodes : [
                //c-n
                { "id"  : "c", "name": "c",      "color": "#D2691E", "group": "A", "val": 3, "type": NODE_TYPES.CORE, "layout": {"x": 100, "y":  0, "z":  0} },
                { "id"  : "n", "name": "n",      "color": "#D2691E", "group": "A", "val": 3, "type": NODE_TYPES.CORE, "layout": {"x":-100, "y":  0, "z":  0} },
                //t-a, a-h
                { "id"  : "t", "name": "t",      "color": "#808080", "group": "B", "val": 3, "type": NODE_TYPES.CORE, "layout": {"x": -60, "y":  0, "z":  0} },
                { "id"  : "a", "name": "a",      "color": "#808080", "group": "B", "val": 3, "type": NODE_TYPES.FIXED, "layout": {"x":   0, "y":  0, "z":  0} },
                { "id"  : "h", "name": "h",      "color": "#444444", "group": "B", "val": 3, "type": NODE_TYPES.CORE, "layout": {"x":  60, "y":  0, "z":  0} },
                //R-L
                { "id"  : "R", "name": "R",      "color": "#7B68EE", "group": "C", "val": 3, "type": NODE_TYPES.CORE, "layout": {"x":   0, "y": 75, "z":  0} },
                { "id"  : "L", "name": "L",      "color": "#ff0000", "group": "C", "val": 3, "type": NODE_TYPES.CORE, "layout": {"x":   0, "y":-75, "z":  0} },
                //S-P
                { "id"  : "S", "name": "\u03A3", "color": "#006400", "group": "D", "val": 3, "type": NODE_TYPES.CORE, "layout": {"x": -90, "y":  0, "z":  0} } ,
                { "id"  : "P", "name": "\u03C0", "color": "#0000CD", "group": "D", "val": 3, "type": NODE_TYPES.CORE, "layout": {"x":  90, "y":  0, "z":  0} }
            ],
            links : [
                //c-n
                { "id": "1", "source": "c", "target": "n", "name": "",          "type": LINK_TYPES.AXIS, "length": 100 },
                //R-L
                { "id": "4", "source": "R", "target": "L", "name": "Pulmonary", "type": LINK_TYPES.PATH, "length":  75 },
                { "id": "5", "source": "L", "target": "R", "name": "Systemic",  "type": LINK_TYPES.PATH, "length":  75 },
                //S-T
                { "id": "6", "source": "S", "target": "P", "name": "Gut",       "type": LINK_TYPES.PATH, "length":  90 },
                { "id": "7", "source": "P", "target": "S", "name": "Gut'",      "type": LINK_TYPES.PATH, "length":  90 }
            ]
        };
        //Demo2: split t-a and a-h links to 7 edges
        const ependymal = {
            nodes: [
                //t-a
                { "id" : "t1", "group": "B", "layout": {"y": 0, "z": 0} },
                { "id" : "t2", "group": "B", "layout": {"y": 0, "z": 0} },
                //a-h
                { "id" : "h1", "group": "B", "layout": {"y": 0, "z": 0} },
                { "id" : "h2", "group": "B", "layout": {"y": 0, "z": 0} },
                { "id" : "h3", "group": "B", "layout": {"y": 0, "z": 0} },
                //a-g
                { "id" : "g1", "group": "B", "layout": {"x": 0, "z": 0} },
                { "id" :  "g", "group": "B", "layout": {"x": 0, "y":  -30, "z":  0} }
            ],
            links: [
                //t-a
                { "id": "2a", "source":  "t", "target": "t1", "name": "Ependymal", "type": LINK_TYPES.LINK, "length":  7, "reversed": true },
                { "id": "2b", "source": "t1", "target": "t2", "name": "Ependymal", "type": LINK_TYPES.LINK, "length":  7, "reversed": true },
                { "id": "2c", "source": "t2", "target":  "a", "name": "Ependymal", "type": LINK_TYPES.LINK, "length":  7, "reversed": true },
                //a-h
                { "id": "3a", "source":  "a", "target": "h1", "name": "Ependymal", "type": LINK_TYPES.LINK, "length":  5, "reversed": true },
                { "id": "3b", "source": "h1", "target": "h2", "name": "Ependymal", "type": LINK_TYPES.LINK, "length":  5, "reversed": true },
                { "id": "3c", "source": "h2", "target": "h3", "name": "Ependymal", "type": LINK_TYPES.LINK, "length":  5, "reversed": true },
                { "id": "3d", "source": "h3", "target":  "h", "name": "Ependymal", "type": LINK_TYPES.LINK, "length":  5, "reversed": true },
                //a-g
                { "id": "3e", "source":  "a", "target": "g1", "name": "Ependymal", "type": LINK_TYPES.LINK, "length":  7 },
                { "id": "3f", "source": "g1", "target":  "g", "name": "Ependymal", "type": LINK_TYPES.LINK, "length":  7 }
            ]
        };

        //Add ependymal links to the model graph
        ependymal.nodes.forEach(node => { coreGraphData.nodes.push(node); });
        ependymal.links.forEach((link, i) => { coreGraphData.links.push(link); });

        this._graphData.nodes = coreGraphData.nodes.map(node => Node.fromJSON(node::assign({"charge": 5})));
        this._graphData.links = coreGraphData.links.map(link => {
            if (link.type !== LINK_TYPES.AXIS) { link.linkMethod = "Line2" }
            return Link.fromJSON(link)
        });
    }


    afterInit(){
        //Coalescence defined as groups of lyphs
        this._coalescences.forEach(lyphs => {
            let coalescingLinks  = lyphs.map(lyph => this._graphData.getLinkByLyphID(lyph)); //always finds only

            coalescingLinks.forEach((link1, i) => {
                coalescingLinks.forEach((link2, j) => {
                    if (i === j) { return; }
                    ["source", "target"].forEach(end => {
                        this._graphData.links.push(Link.fromJSON({
                            "id"    : (this._graphData.links.length + 1).toString(),
                            "source": link1[end],
                            "target": link2[end],
                            "length": 0.1,
                            "type": LINK_TYPES.COALESCENCE
                        }));
                    });
               })
            });
        });

        //Color links and lyphs which do not have assigned colors yet
        addColor(this._graphData.links, "#000");
        addColor(this._lyphs);

        //Create lyph models from their json definitions
        this._lyphs = this._lyphs.map(lyph => Lyph.fromJSON(lyph));

        //Replace layer ids with lyph models
        this._lyphs.filter(lyph => lyph.layers).forEach(lyph => {
            lyph.layers = lyph.layers.map(layer => {return this._lyphs.find(lyph => lyph.id === layer)});
        });

        //Replace content id with lyph model
        this._lyphs.filter(lyph => lyph.content).forEach(lyph => lyph.content = this._lyphs.find(x => x.id === lyph.content));

        //for each link, replace lyph id's with lyph model
        this._graphData.links.forEach(link => link.conveyingLyph = this._lyphs.find(lyph => lyph.id === link.conveyingLyph));

        //place empty layout object to simplify checking for constraints
        this._graphData.nodes.forEach(node => node.layout = node.layout || {} );

        const axisLength = 400;
        const scaleFactor = axisLength * 0.01;

        //Map initial positional constraints to match the scaled image
        this._graphData.nodes.forEach(node =>
            node.layout::keys().forEach(key => {node.layout[key] *= scaleFactor; }));

        this._graphData.links.filter(link => link.length).forEach(link => link.length *= 2 * scaleFactor);
        console.log("Graph", this._graphData);
    }

    get graphData(){
        return this._graphData;
    }

    get lyphs(){
        return this._lyphs;
    }
}