using DocumentsRegistry.API.Models.Entities;
using DocumentsRegistry.API.Models.Requests;
using DocumentsRegistry.API.Models.Responses;
using DocumentsRegistry.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DocumentsRegistry.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentsRepository _repository;
    private readonly ILogger<DocumentsController> _logger;

    public DocumentsController(IDocumentsRepository repository, ILogger<DocumentsController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    [HttpPost]
    public async Task<Response> AddDocument([FromForm] DocumentCreateRequest request)
    {
        _logger.LogInformation("add document is executed");
        return await _repository.AddDocument(request);
    }

    [HttpGet]
    public async Task<IEnumerable<DocumentGridItem>> GetAllDocuments()
    {
        return await _repository.GetAllDocuments();
    }

    [HttpGet("check-registration-code/{code}")]
    public async Task<bool> CheckRegistrationCodeIsUnique(string code)
    {
        return await _repository.CheckRegistrationCodeIsUnique(code);
    }

    [HttpGet("check-file-name/{fileName}")]
    public async Task<bool> CheckFileNameIsUnique(string fileName)
    {
        return await _repository.CheckFileNameIsUnique(fileName);
    }

    [HttpGet("{registrationCode}")]
    public async Task<ActionResult<DocumentEntity>> GetDetailsByRegistrationCode(string registrationCode)
    {
        var document = await _repository.GetDetailsByRegistrationCode(registrationCode);
        if (document is null)
            return NotFound();
        return document;
    }

    [HttpPut("{registrationCode}")]
    public async Task<Response> UpdateDocument(string registrationCode, [FromBody] DocumentUpdateRequest request)
    {
        return await _repository.UpdateDocument(registrationCode, request);
    }
}
