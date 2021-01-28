class TerrainLayer{
    get name(){
        return this._name;
    }
    get show(){
        return this._show;
    }
    set show(val){

    }
    constructor(viewer) {
        this._viewer = viewer;
        this._name = "WGS84 Ellipsoid";
        this._show = true;
        this._currentTerrain = viewer.terrainProvider;
    }


}

export default TerrainLayer;