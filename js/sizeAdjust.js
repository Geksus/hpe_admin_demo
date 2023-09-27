function adjustWidth() {
    let classes = [
        'speedRight',
        'speedLeft',
        'statisticsRight',
        'statisticsLeft',
        'suppressionLeft',
        'suppressionRight',
        'arpRight',
        'generalRight',
        'generalLeft',
        'vlanRight',
        'vlanLeft',
        'vlanItem'
    ]

    for (let className of classes) {
        let maxWidth = 0
        let elements = Array.from(document.getElementsByClassName(className)) // convert HTMLCollection to Array

        // read phase
        for (let element of elements) {
            let width = element.offsetWidth;
            maxWidth = Math.max(maxWidth, width);
        }

        // write phase
        let newWidth = maxWidth + 'px';
        for (let element of elements) {
            element.style.width = newWidth;
        }
    }
}