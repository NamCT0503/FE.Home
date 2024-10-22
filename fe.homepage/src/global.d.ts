declare global {
    interface JQuery {
        slick(options?: any): JQuery;
    }

    interface Window {
        bootsnav: {
            initialize: () => void;
            event: () => void;
            hoverDropdown: () => void;
            navbarSticky: () => void;
            navbarScrollspy: () => void;
        };
    }
}
  
export {};  