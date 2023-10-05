/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.controllers;


import java.util.logging.Logger;
import java.util.logging.Level;

import com.google.gson.Gson;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.services.BlueprintsServices;

/**
 *
 * @author hcadavid
 */
@RestController
@RequestMapping(value = "/blueprints")
public class BlueprintAPIController {
    
    @Autowired
    BlueprintsServices bs;
    
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> manejadorGetRecursoXX(){
        try {
            //obtener datos que se enviarán a través del API
            Gson gson = new Gson();
            return new ResponseEntity<>(gson.toJson(bs.getAllBlueprints()), HttpStatus.ACCEPTED);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintNotFoundException.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error bla bla bla",HttpStatus.NOT_FOUND);
        }      
    }

    @RequestMapping(path = "/{author}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBluePrintsByAuthor(@PathVariable String author) throws BlueprintNotFoundException{
        try {
            //obtener datos que se enviarán a través del API
            Gson gson = new Gson();
            return new ResponseEntity<>(gson.toJson(bs.getBlueprintsByAuthor(author)), HttpStatus.ACCEPTED);
        } catch (BlueprintNotFoundException ex) {
            //Logger.getLogger(BlueprintNotFoundException.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("The author: "+ author +" doen't exist, 404 error", HttpStatus.NOT_FOUND);
        }      
    } 
    
    @RequestMapping(path = "/{author}/{bpname}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBlueprintByAuthorName(@PathVariable String author, @PathVariable String bpname) throws BlueprintNotFoundException{
        try {
            Gson gson = new Gson();
            Blueprint data = bs.getBlueprint(author,bpname);
            return new ResponseEntity<>(gson.toJson(data), HttpStatus.ACCEPTED);
        }catch (BlueprintNotFoundException ex) {
            //Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("EL autor: "+author+" o el nombre del plano: "+bpname+"No coincide, Error 404",HttpStatus.NOT_FOUND);
        }
    } 
    
    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> manejadorPostRecursoXX(@RequestBody Blueprint blueprint){
        try {
            bs.addNewBlueprint(blueprint);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }catch (BlueprintNotFoundException | BlueprintPersistenceException ex) {
            //Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Could not be registered",HttpStatus.FORBIDDEN);
        }
    }

    @RequestMapping(path = "/{author}/{bpname}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> manejadorPutRecursoXX(@PathVariable String author, @PathVariable String bpname, @RequestBody Blueprint blueprint) throws BlueprintNotFoundException{
        Blueprint blueprintCreate = null;
        try {
            blueprintCreate = bs.getBlueprint(author, bpname);
            blueprintCreate.setAuthor(blueprint.getAuthor());
            blueprintCreate.setName(blueprint.getName());
            blueprintCreate.setPoints(blueprint.getPoints());

            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        }catch (BlueprintNotFoundException ex) {
            //Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Working...",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 

}

