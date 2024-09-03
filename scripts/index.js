var db = {};

document.addEventListener('DOMContentLoaded', () => {
    const modules = {
        PositionSizeBuilder: PositionSizeBuilder($)
    };

    Object.values(modules).forEach(module => {
        if (typeof module.init === 'function') {
            module.init();
        }
    });
});