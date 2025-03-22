using System.ComponentModel.DataAnnotations;

namespace DocumentsRegistry.API.Models.Entities;

public class DocumentEntity : Document
{
    [Required]
    public string FileName { get; set; } = string.Empty;

    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

}
