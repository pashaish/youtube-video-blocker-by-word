import { Observer } from "./Observer";
import { Storage } from "./Storage";

function main() {
    const obs = new Observer(
        new Storage()
    )

    obs.run();
}

main();