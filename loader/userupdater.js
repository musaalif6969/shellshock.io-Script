var open_prototype = XMLHttpRequest.prototype.open, intercept_response = function(callback) {
    XMLHttpRequest.prototype.open = function(method, url) {
        if(url.indexOf("shellshock.js") > -1) this.isScript = true;
        this.addEventListener('readystatechange', function(event) {
            if ( this.readyState === 4 && this.isScript ) {
                var response = callback(event.target.responseText);
                Object.defineProperty(this, 'response', {writable: true});
                Object.defineProperty(this, 'responseText', {writable: true});
                this.response = this.responseText = response;
            }
        });
        return open_prototype.apply(this, arguments);
    };
};
 
intercept_response(function(response) {
    const [adLine, adVar1, adVar2] = /function (.{2})\(e.{2}\){.\?.+?(?=}f)}function (.{2})/.exec(response);
    const [timer, timerVar, timerVar2, timerVar3] = /function (.{2})\(e\){(.{2})=M.+?(?=1,)1,(.{17}).+?(?=var)/.exec(response);
    window.localStorage.setItem("lastPreRoll", Date.now());
    window.localStorage.setItem("showBigAd", Date.now()+432e5);
    if(!adLine || !adVar1 || !adVar2) {
        console.log('error doing anti adblock')
    } else {
        console.log("[INJECTING] - Adblock popup block");
        const replaceAd = `function ${adVar1}(e){console.log("[ADBLOCK]-blocked"),${adVar2}()}function ${adVar2}`
        response = response.replace(adLine, replaceAd);
    }
    if(!timer || !timerVar || !timerVar2 || !timerVar3) {
        console.log('error doing timer block');
    }
    else {
        console.log("[INJECTING] - Timer block");
        response = response.replace(timer, `function ${timerVar}(e){localStore.setItem("showBigAd",Date.now()+432e5),localStore.setItem("lastPreRoll",Date.now()),setTimeout(()=>{${timerVar2}=-1,${timerVar3}},3000)}`);
    }
    return response;
});
