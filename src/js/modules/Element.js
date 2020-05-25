class Element {
  
  static visible(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    
    const clientRect = element.getBoundingClientRect();
    
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    
    return !(clientRect.bottom < 0 || clientRect.top - viewHeight >= 0);
  }
  
  static animate(node, transition) {
    if (typeof node === 'string') {
      node = document.querySelector(node);
    }

    const handleEnd = () => {
      node.classList.remove('animated', transition);

      node.removeEventListener('animationend', handleEnd);
    };
    
    node.classList.add('animated', transition);

    node.addEventListener('animationend', handleEnd);
  }
  
}

export default Element;
