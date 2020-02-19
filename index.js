import './main.css';
import 'ol/ol.css';

import mbStyle from './mbStyle.json'; //mapbox style json
import Map from 'ol/Map';
import View from 'ol/View';

import proj4 from 'proj4';
import {
    register
} from 'ol/proj/proj4';
import Projection from 'ol/proj/Projection';
import {
    get as getProjection
} from 'ol/proj';
import {
    apply
} from 'ol-mapbox-style';

proj4.defs('EPSG:3765',
    '+proj=tmerc +lat_0=0 +lon_0=16.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
register(proj4);
const proj3765 = getProjection('EPSG:3765');
proj3765.setExtent([208311.05, 4614890.75, 724721.78, 5159767.36]);
const mapDef = new Map({
    target: 'map-container',
    view: new View({
        projection: 'EPSG:3765'
    })
});
window.map= apply(mapDef, mbStyle);
