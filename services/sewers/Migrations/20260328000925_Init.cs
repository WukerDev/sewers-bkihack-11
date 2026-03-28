using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sewers.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Manholes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RAM = table.Column<double>(type: "float", nullable: false),
                    CityLongitude = table.Column<double>(type: "float", nullable: false),
                    CityLatitude = table.Column<double>(type: "float", nullable: false),
                    PricePerTeraflop = table.Column<double>(type: "float", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WindowSchedule = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Manholes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Manholes_Companies_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cpu",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CpuId = table.Column<int>(type: "int", nullable: false),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Threads = table.Column<int>(type: "int", nullable: false),
                    ManholeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cpu", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cpu_Manholes_ManholeId",
                        column: x => x.ManholeId,
                        principalTable: "Manholes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Gpu",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GpuId = table.Column<int>(type: "int", nullable: false),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Vram = table.Column<double>(type: "float", nullable: false),
                    ManholeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gpu", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Gpu_Manholes_ManholeId",
                        column: x => x.ManholeId,
                        principalTable: "Manholes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cpu_ManholeId",
                table: "Cpu",
                column: "ManholeId");

            migrationBuilder.CreateIndex(
                name: "IX_Gpu_ManholeId",
                table: "Gpu",
                column: "ManholeId");

            migrationBuilder.CreateIndex(
                name: "IX_Manholes_OwnerId",
                table: "Manholes",
                column: "OwnerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cpu");

            migrationBuilder.DropTable(
                name: "Gpu");

            migrationBuilder.DropTable(
                name: "Manholes");

            migrationBuilder.DropTable(
                name: "Companies");
        }
    }
}
