using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DocumentsRegistry.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Documents",
                columns: table => new
                {
                    RegistrationCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateToSend = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DocumentCode = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    DeliveryType = table.Column<byte>(type: "tinyint", nullable: false),
                    CorrespondentType = table.Column<byte>(type: "tinyint", nullable: false),
                    Topic = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Deadline = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    IsControlled = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.RegistrationCode);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Documents_FileName",
                table: "Documents",
                column: "FileName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Documents");
        }
    }
}
