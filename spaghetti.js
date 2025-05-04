// Antipattern: Spaghetti code;
// JMP, GOTO (Not applicable to JS);
// Callbacks;
// Events;
// ------------------------------------------------------------------------------------
// Callback Hell (Spaghetti Code);
{
    const invoke = (validate, fn, a, b, callback) => {
        const result = fn(validate, a, b);
        callback(null, result);
    };
    //- Смешивание валидации и логики.
    //- Глубокая вложенность (если fn тоже принимает колбэк).
    //- Сложно читать и поддерживать.
}
// ------------------------------------------------------------------------------------
// Resolution: Responsibility sharing + Promises/async-await;
{
    const invoke = async (validate, fn, a, b) => {
        return fn(validate, a, b);
    };

// Использование:
    try {
        const result = await invoke(validate, sum, 5, 10);
        console.log(result);
    } catch (error) {
        console.error(error);
    }
// Почему лучше:
// - Заменяем callback-и на Promise/async-await, что делает код линейным и читаемым.
// - Убираем callback Hell.
// - Ошибки обрабатываются через try/catch, что более естественно.
// - Код становится проще для тестирования и отладки.
}
// ------------------------------------------------------------------------------------
// Events
{
    const { EventEmitter } = require('events');

    const incoming = new EventEmitter();
    const controller = new EventEmitter();
    const processing = new EventEmitter();

    const parameters = [];

    incoming.on('return', result => {
        console.dir({ result });
    });

    processing.on('max', (a,b) => {
        incoming.emit('return', Math.max(a,b));
    });

    controller.on('parameter', value => {
        parameters.push(value);
    })

    incoming.on('input', data => {
        if (typeof data === 'string') {
            controller.emit('call', data);
        } else {
            controller.emit('parameter', data);
        }
    });

    controller.on('call', name => {
        processing.emit(name, ...parameters);
    });

    incoming.emit('input', 10);
    incoming.emit('input', 20);
    incoming.emit('input', 'max');
}
// ------------------------------------------------------------------------------------
// Resolution:
{
    class Processor {
        constructor() {
            this.parameters = [];
        }

        addParameter(value) {
            this.parameters.push(value);
        }

        execute(command) {
            switch(command) {
                case 'max':
                    return Math.max(...this.parameters);
                default:
                    throw new Error('Unknown command');
            }
        }
    }

// Использование:
    const processor = new Processor();
    processor.addParameter(10);
    processor.addParameter(20);
    const result = processor.execute('max');
    console.log(result);
// Почему лучше:
// - Заменяем EventEmitter на явные вызовы методов класса
// - Состояние (parameters) инкапсулировано в классе, а не размазано по коду
// - Убираем сложную цепочку событий, которая трудна для понимания
// - Код становится более предсказуемым и тестируемым
// - Исчезает проблема "кто и когда эмитит события"
}
// ------------------------------------------------------------------------------------