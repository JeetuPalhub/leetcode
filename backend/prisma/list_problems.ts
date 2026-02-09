
import { db } from '../src/libs/db';

async function main() {
    const problems = await db.problem.findMany({
        select: { id: true, title: true }
    });
    console.log(JSON.stringify(problems, null, 2));
}

main()
    .catch(console.error)
    .finally(() => db.$disconnect());
