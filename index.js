import './main.css';
import 'ol/ol.css';
import '@fortawesome/fontawesome-pro/css/fontawesome.css';
import '@fortawesome/fontawesome-pro/css/duotone.min.css';

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









/**
 *MG to geojson converter
 *
 * @param {*} resourcePath
 */
map.mgIn = function mgIn(resourcePath) { //vikSplit/Data/vodoopskrba
    const a = document.createElement('a');
    a.download = 'geojson.json';
    resourcePath = resourcePath || 'vikSplit/Data/vodoopskrba';
    const classList = [
        "vodoopskrba:Izvor",
        "vodoopskrba:Pumpa",
        "vodoopskrba:Vodospremnik",
        "vodoopskrba:Spoj",
        "vodoopskrba:Vod"
        /*
          "vodoopskrba:Alarm",
          "vodoopskrba:Curenje",
          "vodoopskrba:Geolokacija",
          "vodoopskrba:GeoTocka",
          "vodoopskrba:Havarija",
          "vodoopskrba:Zasun",
          "vodoopskrba:MjernoMjesto",
          "vodoopskrba:PodrucjeZgrada",
           "vodoopskrba:Kanal",
           "vodoopskrba:Kondicioniranje",

          "vodoopskrba:Hidrant",
          "vodoopskrba:HidrantskiVod",

          "vodoopskrba:Prikljucak",
          "vodoopskrba:PrikljucniVod",
          "vodoopskrba:PrikljucnoSedlo"
        */
    ];
    const out = {
        "type": "FeatureCollection",
        "features": []
    };
    out.features = [];
    const p = [];
    const p1 = window.location.protocol + '//' + window.location.host.split(':')[0] + '/mapguide/rest/library/',
        p2 = '.FeatureSource/features.geojson/',
        p3 = '?transformto=LL84';
    for (const [i, v] of classList.entries()) {
        const path = p1 + resourcePath + p2 + v.replace(':', '/') + p3;
        p.push(fetch(path));
    }
    const pr = [];
    Promise.all(p).then(r => {
        for (const [i, v] of r.entries()) {
            pr.push(v.json());
        }
        Promise.all(pr).then(r => {
            let j = 0;
            for (let i = 0; i <= r.length - 1; i++) {
                const features = r[i].features;
                const c = classList[i].split(':')[1];
                for (const f of features) {
                    f.properties.Klasa = c;
                    delete f.properties.FeatId;
                    f.id = j++;
                    Object.keys(f.properties).forEach(function (p) {
                        if (!f.properties[p]) delete f.properties[p];
                    });
                    if (f.geometry) {
                        out.features.push(f);
                    }
                }
            }
            a.addEventListener('click', (evt) => {
                a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], {
                    type: 'application/json;charset=utf-8,\uFEFF'
                }));
            });
            console.log(a, out);
            a.click();
        });
    });
};