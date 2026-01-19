import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBookProcessingStatus1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'books',
      new TableColumn({
        name: 'processing_status',
        type: 'varchar',
        length: '50',
        default: "'pending'",
      }),
    );

    await queryRunner.addColumn(
      'books',
      new TableColumn({
        name: 'processed_pages',
        type: 'integer',
        default: 0,
      }),
    );

    await queryRunner.addColumn(
      'books',
      new TableColumn({
        name: 'processing_message',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('books', 'processing_message');
    await queryRunner.dropColumn('books', 'processed_pages');
    await queryRunner.dropColumn('books', 'processing_status');
  }
}
