using Microsoft.EntityFrameworkCore;
using DefaultNamespace;
using DefaultNamespace.Controllers;
using sewers.Application.State;
using Sewers.Main.Generated;
using SlimMessageBus.Host;
using SlimMessageBus.Host.Memory;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (connectionString != null && connectionString.Contains("${MSSQL_SA_PASSWORD}"))
{
    var password = Environment.GetEnvironmentVariable("MSSQL_SA_PASSWORD") ?? string.Empty;
    connectionString = connectionString.Replace("${MSSQL_SA_PASSWORD}", password);
}

builder.Services.AddDbContext<ApplicationContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddGrpc();

builder.Services.AddCors(o => o.AddPolicy("AllowAll", builder =>
{
    builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
        .WithExposedHeaders("Grpc-Status", "Grpc-Message", "Grpc-Encoding", "Grpc-Accept-Encoding");
}));

builder.Services.AddSingleton<DashboardServiceController>();
builder.Services.AddSingleton<ApplicationState>();

builder.Services.AddSlimMessageBus(mbb =>
{
    mbb.WithProviderMemory(); 
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
    db.Database.Migrate();
}

app.UseRouting();

app.UseCors("AllowAll");

app.UseGrpcWeb(new GrpcWebOptions { DefaultEnabled = true });

app.MapGrpcService<DashboardServiceController>().EnableGrpcWeb();

app.MapGet("/status", () => "I'm alive!");

app.Run();