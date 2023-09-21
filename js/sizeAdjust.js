function adjustWidth() {
    let classes = [
        'speedRight',
        'speedLeft',
        'statisticsRight',
        'statisticsLeft',
        'suppressionLeft',
        'suppressionRight',
        'arpRight'
    ]
    const PADDING_WIDTH = 10; // constant to avoid magic number

    for (let className of classes) {
        let maxWidth = 0
        let elements = Array.from(document.getElementsByClassName(className)) // convert HTMLCollection to Array

        // read phase
        for (let element of elements) {
            let width = element.offsetWidth;
            maxWidth = Math.max(maxWidth, width);
        }

        // write phase
        let newWidth = maxWidth + PADDING_WIDTH + 'px';
        for (let element of elements) {
            element.style.width = newWidth;
        }
    }
}