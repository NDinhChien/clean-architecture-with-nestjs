import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1697427264163 implements MigrationInterface {
    name = 'CreateTables1697427264163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`emails\` (\`email\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`issuedAt\` datetime NOT NULL, \`lastTryAt\` datetime NULL, \`verified\` tinyint NOT NULL DEFAULT 0, \`triedTimes\` int NOT NULL DEFAULT '0', \`refreshedTimes\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`email\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`keys\` (\`user_id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`accessKey\` varchar(255) NOT NULL, \`refreshKey\` varchar(255) NOT NULL, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`logins\` (\`email\` varchar(255) NOT NULL, \`triedTimes\` int NOT NULL, \`lastTryAt\` datetime NOT NULL, PRIMARY KEY (\`email\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('ADMIN', 'GUEST') NOT NULL DEFAULT 'GUEST', \`birthday\` datetime NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`intro\` varchar(1000) NULL, \`createdAt\` datetime NOT NULL, \`editedAt\` datetime NOT NULL, \`removedAt\` datetime NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`logins\``);
        await queryRunner.query(`DROP TABLE \`keys\``);
        await queryRunner.query(`DROP TABLE \`emails\``);
    }

}
