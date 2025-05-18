import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	constructor(config: ConfigService) {
		const url = config.get<string>('DATABASE_URL');
		console.log('database URL:', url);

		super({
			datasources: {
				db: {
					url: url,
				},
			},
		});
	}
	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}

	async cleanDatabase() {
		if (process.env.NODE_ENV === 'production') return;

		// teardown logic
		return Promise.all([this.user.deleteMany()]);
	}
}
