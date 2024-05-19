import request from "supertest"
import app from "../../src/app"

describe('GET /taxis', () => {
  it('should get taxis', async () => {
    const response = await request(app).get('/taxis?limit=11&page=0');
    expect(response.status).toBe(200);
  });

  it('should return the correct number of taxis on the pagination', async () => {
    const response = await request(app).get('/taxis?limit=1&page=0');
    expect(response.body.length).toBe(1);
    console.log(response.body.length)
  });

  it('should return 400 if limit is not a positive integer', async () => {
    const response = await request(app).get('/taxis?limit=-5&page=0');
    expect(response.status).toBe(400);
  });

  it('should return 400 if page is negative', async () => {
    const response = await request(app).get('/taxis?limit=10&page=-5');
    expect(response.status).toBe(400);
  });

  
});

describe('GET /taxis/:id', () => {
  it('should return 400 if id is not a positive integer', async () => {
    const response = await request(app).get('/taxis/-5');
    expect(response.status).toBe(400);
  });

  it('should return 404 if taxi with id does not exist', async () => {
    const response = await request(app).get('/taxis/999');
    expect(response.status).toBe(404);
  });
});

describe('POST /taxis', () => {
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app).post('/taxis').send({});
    expect(response.status).toBe(400);
  });
});

describe('PUT /taxis/:id', () => {
  it('should return 400 if plate is missing', async () => {
    const response = await request(app).put('/taxis/1').send({});
    expect(response.status).toBe(400);
  });
});