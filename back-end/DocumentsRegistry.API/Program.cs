using DocumentsRegistry.API.Data;
using DocumentsRegistry.API.Options;
using DocumentsRegistry.API.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.Configure<BlobStorageOptions>(builder.Configuration.GetSection("BlobStorage"));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnection"), options =>
    {
        options.EnableRetryOnFailure();
        options.CommandTimeout(50000);
    }));

builder.Services.AddScoped<IDocumentsRepository, DocumentsRepository>();
builder.Services.AddScoped<IBlobStorageRepository, BlobStorageRepository>();

var devAllowedOrigins = "_localDevelopment";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: devAllowedOrigins,
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors(devAllowedOrigins);
}

// keep the database updated
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
