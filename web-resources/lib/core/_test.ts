type HandlerConfig = { handler: (idx: number) => void, name: string }


export function __testHandlers(handlers: [string, (idx: number)=>void][], count: number) {
    let result = [];

    handlers.forEach(([name,handler], idx) => {

        let
            c = count,
            d = new Date().getTime(),
            i = 0;

        while (c-- > 0) {
            handler(i++);
        }

        result[idx] = name + ' : ' + (new Date().getTime() - d);
    });

    return result;
}