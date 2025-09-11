document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('colorBtn');
    btn.addEventListener('click', function () {
        document.body.style.backgroundColor =
            '#' + Math.floor(Math.random() * 16777215).toString(16);
    });
});
