class Hero {
    constructor(name, level) {
        this.name = name;
        this.level = level;
    }

    // Adding a method to the constructor
    greet() {
        return `${this.name} says hello.`;
    }
}
console.log('Loaded object');
export function test() {
    console.log('test func');
    
}
test();