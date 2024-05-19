// Pruebas end-to-end
import request from "supertest";
import app from "../../src/app"


describe("GET /taxis/trajectories/:taxiId", () => {

  it("should return 404 if there weren't any trajectories with the date", async () => {
    const response = await request(app).get("/taxis/trajectories/1?date=2008-02-03&limit=4&page=3");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "No trajectories found for the specified date" });
  });

   it("should return 400 if id is not provided", async () => {
    const response = await request(app).get("/taxis/trajectories/date=2008-02-03&limit=4&page=3");
    expect(response.status).toBe(400);
  });
  
  it("should return 400 if date is not provided", async () => {
    const response = await request(app).get("/taxis/trajectories/1?limit=10&page=0");
    expect(response.status).toBe(400);
  });

  it("should return 400 if limit is not provided", async () => {
    const response = await request(app).get("/taxis/trajectories/1?page=0");
    expect(response.status).toBe(400);
  });

  it("should return 400 if page is not provided", async () => {
    const response = await request(app).get("/taxis/trajectories/1?limit=10");
    expect(response.status).toBe(400);
  });

  it("should return 400 if limit is not a positive integer", async () => {
    const response = await request(app).get("/taxis/trajectories/1?date=2023-05-10&limit=-5&page=0");
    expect(response.status).toBe(400);
  });

  it("should return 400 if page is negative", async () => {
    const response = await request(app).get("/taxis/trajectories/1?date=2023-05-10&limit=10&page=-5");
    expect(response.status).toBe(400);
  });


 
});


describe("GET /trajectories", () => {
  it('should get taxis', async () => {
    const response = await request(app).get('/trajectories?limit=11&page=0');
    expect(response.status).toBe(200);
  });

  it('should return the correct number of taxis on the pagination', async () => {
    const response = await request(app).get('/trajectories?limit=1&page=0');
    expect(response.body.length).toBe(1);
    console.log(response.body.length)
  });

  it('should return 400 if limit is not a positive integer', async () => {
    const response = await request(app).get('/trajectories?limit=-5&page=0');
    expect(response.status).toBe(400);
  });

  it('should return 400 if page is negative', async () => {
    const response = await request(app).get('/trajectories?limit=10&page=-5');
    expect(response.status).toBe(400);
  });

 
});