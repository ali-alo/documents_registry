namespace DocumentsRegistry.API.Models.Responses;

public class DocumentGridItem
{
    public string FileName { get; set; } = string.Empty;
    public string RegistrationCode { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
    public string DocumentCode { get; set; } = string.Empty;
    public DateTime DateToSend { get; set; }
    public byte CorrespondentType { get; set; }
    public string Topic { get; set; } = string.Empty;
}
