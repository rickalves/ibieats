import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Response } from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

// Teste de Integração Básico: Verifica se o login funciona (controlador + JWT)
describe('ApiGateway Integration Test', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should login successfully and return access token', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'password' })
      .expect(201) // NestJS padrão para POST sem status customizado
      .expect((res: Response) => {
        const body = res.body as { access_token: string };
        expect(body).toHaveProperty('access_token');
        expect(typeof body.access_token).toBe('string');
      });
  });
});
