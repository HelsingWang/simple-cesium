import '/css/main.css';
import {SimpleMap} from './core/SimpleMap';
import {Util} from './common/Util';
import {ToolbarWidget} from './widgets/ToolbarWidget';

// startUp
const map = new SimpleMap();
map.startUp(map.properties.container);
Util.get('config/ui.json', function (text) {
    if (text) {
        text = Util.removeComments(text);
        const jsonData = JSON.parse(text);
        if (jsonData) {
            if (jsonData.floatToolbar && jsonData.floatToolbar.items) {
                const floatToolbar = new ToolbarWidget({...jsonData.floatToolbar, map: map});
                floatToolbar.addAll();
                floatToolbar.startUp();
            }
        }
    }
});

// export
export var VERSION = '1.0';
console.log('SimpleCesium V' + VERSION);

export {SimpleMap} from './core/SimpleMap';
