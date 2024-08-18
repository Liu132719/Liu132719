
    /**
     * 获得参数值
     * @param arr
     * @returns {null|*}
     * @author YonDu
     */
    function roop_params_value(key) {
        for(let line of roop_params) {
            if(line.key == key){
                return line.value;
            }
        }
        return null;
    }

    /**
     * 设置参数值
     * @param key
     * @param value
     * @author YonDu
     */
function roop_params_set(key,value) {
        for(let line of roop_params) {
            if(line.key == key){
                line.value = value;
            }
        }
}


function setting_format(json) {
    let default_settings = (typeof(json.default) != 'undefined') ? json.default : {};
    // let target_source_path = (typeof(def.target_source_path) == 'string') ? def.target_source_path : '';
    let settings = {
        "default" : default_settings,
    }
    return settings;
}

    