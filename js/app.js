/**
 * Define Global Variables
 *
*/
const MENU_LINK_CLASS = 'menu__link';
const NAV_MENU_ATTR = 'data-nav';
const ACTIVE_CLASS = 'active';
const SECTION_TAG = 'section';

/**
 * @description Builds list of thresholds for observers.
 * @description By default builds threshold points from  0.05, 0.1, 0.15...1.0. Specify params to have custom threshold points
 * @constructor
 * @param {number} start - the starting ratio of the threshold
 * @param {number} thresholdSteps - the number of threshold points to have for an observer
 * @returns {Array} array of numbers as thresholds
 */
function buildThresholdList(start=1.0, thresholdSteps=20) {
    let thresholds = [];

    for(let i = start; i <= thresholdSteps; i++) {
        let ratio = i/thresholdSteps;
        thresholds.push(ratio);
    }

    return thresholds;
}

/**
 * @description Sets up 'section' observer to turn section nearing top of view port as active
 */
function createSectionObserver() {
    let sectionObserver;

    let options = {
        root: null, //sets root as view port if specified as null or omitted from options
        rootMargin: '0px',
        threshold: buildThresholdList()
    };

    //InitializeObserver
    sectionObserver = new IntersectionObserver(handleSectionIntersect, options);

    //Observe for all section tags
    let sections = document.querySelectorAll(SECTION_TAG);
    sections.forEach(section => sectionObserver.observe(section));
}

/**
 * @description Function to construct Navigation 'li' based on number of sections in the DOM.
 */
function constructNav() {
    const sections = document.querySelectorAll(SECTION_TAG);
    const navList = document.querySelector('#navbar__list');

    //Bail out early
    if(sections.length === 0) {
        return;
    }

    const listFragment = document.createDocumentFragment();
    sections.forEach((section) => {
        const listElement = document.createElement('li');

        const anchorElement= document.createElement('a');
        anchorElement.setAttribute('href', `#${section.getAttribute('id')}`);
        anchorElement.setAttribute('class', MENU_LINK_CLASS);
        anchorElement.textContent = section.getAttribute(NAV_MENU_ATTR);

        listElement.appendChild(anchorElement);

        listFragment.appendChild(listElement);
    });
    navList.appendChild(listFragment);
}

/**
 * @description Handles the intersection of target element with the root(viewport here)
 * @constructor
 * @param {IntersectionObserverEntry} entries - instances of IntersectionObserverEntry delivered to an IntersectionObserver callback in its entries parameter
 * @param {IntersectionObserver} observer - instance of IntersectionObserver created which calls this handler on target intersection
 */
function handleSectionIntersect(entries, observer) {
    entries.forEach((entry) => {
        if(entry.isIntersecting && entry.intersectionRatio > 0.7) {
            entry.target.classList.add(ACTIVE_CLASS);
        } else {
            entry.target.classList.remove(ACTIVE_CLASS);
        }
    });
}

/**
 * @description Sets smooth scrolling to correspoding sections in page when nav menu is clicked
 */
function setSmoothScrolling() {
    const navList = document.querySelector('#navbar__list');

    //Add event listener to <ul> tag instead of adding in each anchor tags & use target attribute to identify the target click
    navList.addEventListener('click', (event) => {
        if(event.target.nodeName === 'A') {
            const scrollToSection = event.target.getAttribute('href');
            const item = document.querySelector(scrollToSection);
            item.scrollIntoView({
                behavior: 'smooth'
            });
            event.preventDefault(); //otherwise default jump behavior eclipses smooth scroll into view
        }
    });
}

//Dynamic construction of nav menu and setting up smooth scrolling and section intersection observer on DOMContentLoaded event
document.addEventListener('DOMContentLoaded', (event) => {
    // Build menu
    constructNav();
    // Scroll to section on link click
    //setSmoothScrolling();
    // To set appropriate section as active
    createSectionObserver();
}, false);
