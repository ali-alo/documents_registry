using System.ComponentModel.DataAnnotations;

namespace DocumentsRegistry.API.Models.Requests;

public class DocumentCreateRequest : Document
{
    [Required]
    public IFormFile File { get; set; } = default!;
}
